/* (function () {
  const module = {

    url: 'https://todos.simpleapi.dev/api/todos',
    apiKey: '362dec4d-cc18-4ef2-bc02-695ebac41750',

    cacheDom: function () {
      this.formContainer = document.getElementById('form-container');
      this.form = document.getElementById('form-id');
      this.input = document.getElementById('input-id');
      this.addButton = document.getElementById('submit-button-id-icon');
      this.icon = document.getElementById('icon-id');
      this.toggle = document.getElementById('toggle');
      this.labelToggle = document.getElementById('label_toggle');
      this.headerBox = document.getElementById('header-box');
      this.mainBox = document.getElementById('container-to-do-list');
      this.taskCounter = document.getElementById('counter');
      this.list = document.getElementById('list-to-do');
    },
    main: function () {
      document.addEventListener('DOMContentLoaded', () => {
        this.tasks = [];
        this.cacheDom();
        this.loadTasksFromAPI();
        this.bindEvents();
        this.updateTaskCounter();
        this.toggle.checked = localStorage.getItem('darkMode') === 'true';
        this.toggleDarkMode();
      });
    },
  
    saveTasksToLocalStorage: function () {
      const tasksState = {};
      this.tasks.forEach((task) => {
        tasksState[task.id] = task.completed;
        localStorage.setItem(`task-${task.id}`, JSON.stringify(task.completed));
      });
      localStorage.setItem('tasksState', JSON.stringify(tasksState));
    },
    
    
  

    createItems: function (todo) {
      const buttonsDiv = document.createElement('div');
      const editButton = document.createElement('button');
      const deleteButton = document.createElement('button');
      const listItem = document.createElement('li');
      const checkboxDiv = document.createElement('div');
      const label = document.createElement('label');
      const checkbox = document.createElement('div'); // Mantenemos el elemento como <div>
    
      listItem.id = `list-item-${todo.id}`;
      listItem.className = `BodyMain-list-custom d-flex justify-content-between align-items-center`;
    
      checkboxDiv.className = 'BodyMain-checkbox';
      checkbox.className = `fa-sharp fa-solid fa-circle-check BodyMain-radio-task`;
      checkbox.id = `task-${todo.id}`;
    
      // Cargar el estado de la tarea desde el localStorage (si existe)
      const isTaskCompleted = localStorage.getItem(`task-${todo.id}`);
      if (isTaskCompleted) {
        todo.completed = JSON.parse(isTaskCompleted);
        label.style.textDecoration = todo.completed ? 'line-through' : 'none';
      }
    
      checkbox.addEventListener('click', () => {
        todo.completed = !todo.completed;
        label.style.textDecoration = todo.completed ? 'line-through' : 'none';
        this.saveTasksToLocalStorage(); // Guardar el estado de las tareas en localStorage
      });
    
      checkboxDiv.appendChild(checkbox);
    
      label.htmlFor = `task-${todo.id}`;
      label.textContent = todo.description;
      label.className = 'BodyMain-label-task';
    
      checkbox.checked = todo.completed;
      label.style.textDecoration = checkbox.checked ? 'line-through' : 'none';
    
      checkboxDiv.appendChild(label);
      listItem.appendChild(checkboxDiv);
    
      buttonsDiv.className = 'BodyMain-buttons';
    
      editButton.className = 'BodyMain-button-edit BodyMain-task-buttons btn btn-outline-primary btn-sm mr-2';
      editButton.innerHTML = '<i class="BodyMain-icon-edit fas fa-edit"></i>';
      buttonsDiv.appendChild(editButton);
    
      deleteButton.className = 'BodyMain-button-delete BodyMain-task-buttons btn btn-outline-danger btn-sm';
      deleteButton.innerHTML = '<i class="BodyMain-icon-trash fas fa-trash"></i>';
      buttonsDiv.appendChild(deleteButton);
    
      listItem.appendChild(buttonsDiv);
      this.list.appendChild(listItem);
    
      editButton.addEventListener('click', () => this.editTask(todo, todo.id));
      deleteButton.addEventListener('click', () => this.deleteTask(todo.id));
    },
    updateTaskCounter: function () {
      this.taskCounter.textContent = this.tasks.length;
    },
    renderList: async function () {
      const status = this.loadTasksFromAPI();
      console.log("status:", status)
      if (status === 200) {
        this.list.innerHTML = '';
        console.log("hola")
        this.tasks.forEach((task) => {
          this.createItems(task);
        });
      }
    },
    addTaskToList: async function (task) {
      try {
        const newTask = {
          "description": `${task}`,
          "completed": false,
          "meta": {}
        };

        const { data, status } = await axios.post(`${this.url}?apikey=${this.apiKey}`, newTask);

        if (status === 200) {
          console.log("esto tiene data:", data)
          this.tasks.push(data);
          this.createItems(data);

          this.applyItemStyle();

          this.updateTaskCounter();
        }

      } catch (error) {
        window.alert(error);
      }
    },

    loadTasksFromAPI: async function () {
      try {
        const { data, status } = await axios.get(`${this.url}?apikey=${this.apiKey}`);
        this.tasks = data || [];
    
        const tasksState = JSON.parse(localStorage.getItem('tasksState')) || {};
        this.tasks.forEach((task) => {
          if (tasksState[task.id] !== undefined) {
            task.completed = tasksState[task.id];
          }
        });
    
        if (status === 200) {
          this.list.innerHTML = '';
          this.tasks.forEach((task) => {
            this.createItems(task);
          });
          this.applyItemStyle();
          this.updateTaskCounter();
        }
      } catch (error) {
        window.alert(error);
      }
    },
    
    randomId: function (length = 6) {
      return Math.random().toString(36).substring(2, length + 2);
    },
    updateListItem: function (listItem, task) {
      const label = listItem.querySelector('label');
      label.textContent = task.text;
      label.style.display = 'flex';
    },

    
    editTask: async function (task, taskId) {
      const listItem = document.getElementById(`list-item-${taskId}`);
      if (!listItem) return;
    
      const label = listItem.querySelector('label');
      const inputEdit = document.createElement('input');
      const updateButton = document.createElement('button');
    
      const existingInput = listItem.querySelector('.BodyMain-input-edit-task');
      const existingButton = listItem.querySelector('.BodyMain-button-update-task');
    
      if (existingInput || existingButton) return;
    
      inputEdit.type = 'text';
      inputEdit.value = task.description;
      inputEdit.className = 'BodyMain-input-edit-task';
    
      updateButton.className = 'BodyMain-button-update-task';
      updateButton.textContent = 'Update';
    
      const editFormContainer = document.createElement('div');
      editFormContainer.className = 'BodyMain-form-task';
    
      editFormContainer.appendChild(inputEdit);
      editFormContainer.appendChild(updateButton);
    
      const parentElement = label.parentNode;
      parentElement.insertBefore(editFormContainer, label.nextSibling);
    
      label.style.display = 'none';
      listItem.querySelector('.BodyMain-buttons').style.display = 'none';
    
      // Función para guardar los cambios realizados en la tarea
      const saveChanges = async () => {
        const updatedTaskDescription = inputEdit.value.trim();
        if (updatedTaskDescription !== '') {
          try {
            const updatedTask = {
              description: updatedTaskDescription,
              completed: task.completed,
              meta: task.meta,
            };
    
            const { description } = updatedTask;
            const { data, status } = await axios.put(`${this.url}/${taskId}?apikey=${this.apiKey}`, { description });
    
            if (status === 200) {
              task.description = data.description;
              label.textContent = data.description;
            }
          } catch (error) {
            window.alert(error);
          }
        }
    
        label.style.display = 'flex';
        listItem.querySelector('.BodyMain-buttons').style.display = 'flex';
        inputEdit.remove();
        updateButton.remove();
      };
    
      // Escuchar el evento 'keydown' en el campo de edición
      inputEdit.addEventListener('keydown', async (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          saveChanges();
        }
      });
    
      // Escuchar el evento 'click' en el botón de edición
      updateButton.addEventListener('click', async () => {
        saveChanges();
      });
    
      // Escuchar el evento 'blur' en el campo de edición (si el usuario hace clic fuera del campo)
      inputEdit.addEventListener('blur', () => {
        saveChanges();
      });
    },
    
    deleteTask: async function (taskId) {
      try {
        const { status } = await axios.delete(`${this.url}/${taskId}?apikey=${this.apiKey}`);
        console.log(status)
        if (status === 200) {
          const listItem = document.getElementById(`list-item-${taskId}`);
          if (listItem) {
            const parentList = listItem.parentNode;
            parentList.removeChild(listItem);
            this.tasks = this.tasks.filter((task) => task.id !== taskId);
            this.applyItemStyle();
            this.updateTaskCounter();
          }
        }
      } catch (error) {
        window.alert(error);
      }
    },
    
    applyItemStyle: function () {
      const taskListItems = this.list.querySelectorAll('li');

      taskListItems.forEach((item, index) => {

        const currentIsDark = index % 2 === 0;

        item.classList.remove(this.toggle.checked ? 'BodyMain-list-custom-light' : 'BodyMain-list-custom-dark');
        item.classList.add(`BodyMain-list-custom-${this.toggle.checked ? 'dark' : 'light'}`);

        const bgColor = this.toggle.checked
          ? currentIsDark ? 'var(--background-table-dark-secundary)' : 'var(--background-table-dark-primary)'
          : currentIsDark ? 'var(--background-table-light-secundary)' : 'var(--background-table-light-principal)';

        item.style.backgroundColor = bgColor;
        item.style.color = `var(--text-${this.toggle.checked ? 'white' : 'black'}-list)`;
      });
    },
    bindEvents: function () {
      window.addEventListener('DOMContentLoaded', () => {
        const savedDarkMode = localStorage.getItem('darkMode');

        this.toggle.checked = savedDarkMode === 'true';
      });

      this.addButton.addEventListener('click', (event) => {
        event.preventDefault();
        const inputValue = this.input.value.trim();
        if (inputValue !== '') {
          this.addTaskToList(inputValue);
          this.input.value = ''
        }
      });

      this.input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          const inputValue = this.input.value.trim();
          if (inputValue !== '') {
            this.addTaskToList(inputValue);
            this.input.value = ''; // Limpiar el input después de agregar la tarea
          }
        }
      });

      this.toggle.addEventListener('change', (event) => {
        const checked = event.target.checked;

        this.toggleDarkMode();
        localStorage.setItem('darkMode', checked.toString());
      });
    },

    toggleDarkMode: function () {
      const isDarkModeEnabled = this.toggle.checked;
      const bodyClassList = document.body.classList;
      const mainBoxClassList = this.mainBox.classList;
      const headerBoxClassList = this.headerBox.classList;

      if (isDarkModeEnabled) {
        bodyClassList.add('BodyMainDark');
        mainBoxClassList.add('BodyMainDark-dark-main-box');
        headerBoxClassList.add('BodyMainDark-header-box');
      } else {
        bodyClassList.remove('BodyMainDark');
        mainBoxClassList.remove('BodyMainDark-dark-main-box');
        headerBoxClassList.remove('BodyMainDark-header-box');
      }

      this.applyItemStyle();

      this.labelToggle.innerHTML = isDarkModeEnabled ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
      this.labelToggle.style.color = isDarkModeEnabled ? 'var(--orenge-sun)' : 'var(--purple-moon)';

      localStorage.setItem('darkMode', isDarkModeEnabled.toString());
    },
  };

  module.main();
})();
 */


(function () {
  const module = {

    url: 'https://todos.simpleapi.dev/api/users',
    apiKey: '362dec4d-cc18-4ef2-bc02-695ebac41750',
    urlTodo: '/',
    urlSignUp: "/pages/signup.html",
    urlLogIn: "/pages/login.html",

    cacheDom: function () {
      this.formContainer = document.getElementById('form-container');
      this.form = document.getElementById('form-id');
      this.input = document.getElementById('input-id');
      this.addButton = document.getElementById('submit-button-id-icon');
      this.icon = document.getElementById('icon-id');
      this.toggle = document.getElementById('toggle');
      this.labelToggle = document.getElementById('label_toggle');
      this.headerBox = document.getElementById('header-box');
      this.mainBox = document.getElementById('container-to-do-list');
      this.taskCounter = document.getElementById('counter');
      this.list = document.getElementById('list-to-do');
      this.signUpForm = document.getElementById('signup-form');
      this.logInForm = document.getElementById('log-in-form');
    },

    main: function () {

      switch (window.location.pathname) {
        case this.urlLogIn:
          this.cacheDom();
          this.bindEvents();
          break;

        case this.urlSignUp:
          this.cacheDom();
          this.bindEvents();
          break;

        case this.urlTodo:

          this.user = JSON.parse(localStorage.getItem('UserState'));
          this.cacheDom();
          this.loadTasksFromAPI();
          this.tasks = [];
         
          this.bindEvents();
          this.updateTaskCounter();

          document.addEventListener('DOMContentLoaded', () => {

            this.toggle.checked = localStorage.getItem('darkMode') === 'true';
            this.toggleDarkMode();
          });
          break;
      };



      //

    },
    submitSignUpForm: async function (event) {
      event.preventDefault(); // Evitar que el formulario se envíe automáticamente

      const firstName = document.getElementById('InputName').value;
      const email = document.getElementById('InputEmail').value;
      const password = document.getElementById('InputPassword').value;


      const agreedToTerms = document.getElementById('Check').checked;

      if (!agreedToTerms) {
        alert("Please agree to the terms and conditions before signing up.");
        return;
      }


      if (!firstName || !email || !password) {
        alert("Please fill out all the fields.");
        return;
      }

      // Crear un objeto con los datos del nuevo usuario
      const newUser = {
        "email": email,
        "name": firstName,
        "password": password
      };
      console.log(newUser)
      try {
        // Realizar una solicitud POST al servidor para crear la cuenta del usuario
        const response = await axios.post(`${this.url}/register?apikey=${this.apiKey}`, newUser);
        console.log(response)


        // Si la respuesta es exitosa, el usuario se ha registrado correctamente
        if (response.status === 200) {
          alert("Sign-up successful! You can now log in with your credentials.");
          // Aquí puedes redirigir al usuario a la página de inicio de sesión
          window.location.href = "../pages/login.html";
        }
      } catch (error) {
        // Si hay un error en la solicitud, muestra un mensaje de error
        alert("Error signing up. Please try again later.");
        console.error(error);
      }
    },

    submitLogInForm: async function (event) {
      event.preventDefault(); // Evitar que el formulario se envíe automáticamente

      const email = document.getElementById('LogInputEmail1').value;
      const password = document.getElementById('LogInputPassword').value;


      if (!email || !password) {
        alert("Please fill out all the fields.");
        return;
      }

      // Crear un objeto con los datos del nuevo usuario
      const dataUser = {
        "email": email,
        "password": password
      };
      console.log(dataUser)
      try {
        // Realizar una solicitud POST al servidor para crear la cuenta del usuario
        const { data, status } = await axios.post(`${this.url}/login?apikey=${this.apiKey}`, dataUser);




        // Si la respuesta es exitosa, el usuario se ha registrado correctamente
        if (status === 200) {
          alert("Log-in successful! You can now edit your To Do List.");

          localStorage.setItem('UserState', JSON.stringify(data));
          // Aquí puedes redirigir al usuario a la página de inicio de sesión
          window.location.href = this.urlTodo;

        }
      } catch (error) {
        // Si hay un error en la solicitud, muestra un mensaje de error
        alert("Error signing up. Please try again later.");
        console.error(error);
      }
    },


    saveTasksToLocalStorage: function () {
      const tasksState = {};
      this.tasks.forEach((task) => {
        tasksState[task.id] = task.completed;
        localStorage.setItem(`task-${task.id}`, JSON.stringify(task.completed));
      });
      localStorage.setItem('tasksState', JSON.stringify(tasksState));
    },




    createItems: function (todo) {
      const buttonsDiv = document.createElement('div');
      const editButton = document.createElement('button');
      const deleteButton = document.createElement('button');
      const listItem = document.createElement('li');
      const checkboxDiv = document.createElement('div');
      const label = document.createElement('label');
      const checkbox = document.createElement('div'); // Mantenemos el elemento como <div>

      listItem.id = `list-item-${todo.id}`;
      listItem.className = `BodyMain-list-custom d-flex justify-content-between align-items-center`;

      checkboxDiv.className = 'BodyMain-checkbox';
      checkbox.className = `fa-sharp fa-solid fa-circle-check BodyMain-radio-task`;
      checkbox.id = `task-${todo.id}`;

      // Cargar el estado de la tarea desde el localStorage (si existe)
      const isTaskCompleted = localStorage.getItem(`task-${todo.id}`);
      if (isTaskCompleted) {
        todo.completed = JSON.parse(isTaskCompleted);
        label.style.textDecoration = todo.completed ? 'line-through' : 'none';
      }

      checkbox.addEventListener('click', () => {
        todo.completed = !todo.completed;
        label.style.textDecoration = todo.completed ? 'line-through' : 'none';
        this.saveTasksToLocalStorage(); // Guardar el estado de las tareas en localStorage
      });

      checkboxDiv.appendChild(checkbox);

      label.htmlFor = `task-${todo.id}`;
      label.textContent = todo.description;
      label.className = 'BodyMain-label-task';

      checkbox.checked = todo.completed;
      label.style.textDecoration = checkbox.checked ? 'line-through' : 'none';

      checkboxDiv.appendChild(label);
      listItem.appendChild(checkboxDiv);

      buttonsDiv.className = 'BodyMain-buttons';

      editButton.className = 'BodyMain-button-edit BodyMain-task-buttons btn btn-outline-primary btn-sm mr-2';
      editButton.innerHTML = '<i class="BodyMain-icon-edit fas fa-edit"></i>';
      buttonsDiv.appendChild(editButton);

      deleteButton.className = 'BodyMain-button-delete BodyMain-task-buttons btn btn-outline-danger btn-sm';
      deleteButton.innerHTML = '<i class="BodyMain-icon-trash fas fa-trash"></i>';
      buttonsDiv.appendChild(deleteButton);

      listItem.appendChild(buttonsDiv);
      this.list.appendChild(listItem);

      editButton.addEventListener('click', () => this.editTask(todo, todo.id));
      deleteButton.addEventListener('click', () => this.deleteTask(todo.id));
    },
    updateTaskCounter: function () {
      this.taskCounter.textContent = this.tasks.length;
    },
  /*   renderList: async function () {
      const status = this.loadTasksFromAPI();
      console.log("status:", status)
      if (status === 200) {
        this.list.innerHTML = '';
        console.log("hola")
        this.tasks.forEach((task) => {
          this.createItems(task);
        });
      }
    }, */
    addTaskToList: async function (task) {
      try {
        const newTask = {
          "description": `${task}`,
          "completed": false,
          "meta": {}
        };

        const { data, status } = await axios.post(`${this.url}?apikey=${this.apiKey}`, newTask);

        if (status === 200) {
          console.log("esto tiene data:", data)
          this.tasks.push(data);
          this.createItems(data);

          this.applyItemStyle();

          this.updateTaskCounter();
        }

      } catch (error) {
        window.alert(error);
      }
    },

    loadTasksFromAPI: async function () {
      try {

        console.log("estoy cargando las tareas")
        console.log(this.user)

        const { data, status } = await axios.get(`${this.url}/${this.user.id}/todos?apikey=${this.apiKey}`, "", {
          headers: {
            'Authorization': `Bearer ${this.user.token}`
          }
        });
        console.log(data)
        this.tasks = data || [];

        const tasksState = JSON.parse(localStorage.getItem('tasksState')) || {};
        this.tasks.forEach((task) => {
          if (tasksState[task.id] !== undefined) {
            task.completed = tasksState[task.id];
          }
        });

        if (status === 200) {
          this.list.innerHTML = '';
          this.tasks.forEach((task) => {
            this.createItems(task);
          });
          this.applyItemStyle();
          this.updateTaskCounter();
        }
      } catch (error) {
        window.alert(error);
      }
    },

    randomId: function (length = 6) {
      return Math.random().toString(36).substring(2, length + 2);
    },
    updateListItem: function (listItem, task) {
      const label = listItem.querySelector('label');
      label.textContent = task.text;
      label.style.display = 'flex';
    },


    editTask: async function (task, taskId) {
      const listItem = document.getElementById(`list-item-${taskId}`);
      if (!listItem) return;

      const label = listItem.querySelector('label');
      const inputEdit = document.createElement('input');
      const updateButton = document.createElement('button');

      const existingInput = listItem.querySelector('.BodyMain-input-edit-task');
      const existingButton = listItem.querySelector('.BodyMain-button-update-task');

      if (existingInput || existingButton) return;

      inputEdit.type = 'text';
      inputEdit.value = task.description;
      inputEdit.className = 'BodyMain-input-edit-task';

      updateButton.className = 'BodyMain-button-update-task';
      updateButton.textContent = 'Update';

      const editFormContainer = document.createElement('div');
      editFormContainer.className = 'BodyMain-form-task';

      editFormContainer.appendChild(inputEdit);
      editFormContainer.appendChild(updateButton);

      const parentElement = label.parentNode;
      parentElement.insertBefore(editFormContainer, label.nextSibling);

      label.style.display = 'none';
      listItem.querySelector('.BodyMain-buttons').style.display = 'none';

      // Función para guardar los cambios realizados en la tarea
      const saveChanges = async () => {
        const updatedTaskDescription = inputEdit.value.trim();
        if (updatedTaskDescription !== '') {
          try {
            const updatedTask = {
              description: updatedTaskDescription,
              completed: task.completed,
              meta: task.meta,
            };

            const { description } = updatedTask;
            const { data, status } = await axios.put(`${this.url}/${taskId}?apikey=${this.apiKey}`, { description });

            if (status === 200) {
              task.description = data.description;
              label.textContent = data.description;
            }
          } catch (error) {
            window.alert(error);
          }
        }

        label.style.display = 'flex';
        listItem.querySelector('.BodyMain-buttons').style.display = 'flex';
        inputEdit.remove();
        updateButton.remove();
      };

      // Escuchar el evento 'keydown' en el campo de edición
      inputEdit.addEventListener('keydown', async (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          saveChanges();
        }
      });

      // Escuchar el evento 'click' en el botón de edición
      updateButton.addEventListener('click', async () => {
        saveChanges();
      });

      // Escuchar el evento 'blur' en el campo de edición (si el usuario hace clic fuera del campo)
      inputEdit.addEventListener('blur', () => {
        saveChanges();
      });
    },

    deleteTask: async function (taskId) {
      try {
        const { status } = await axios.delete(`${this.url}/${taskId}?apikey=${this.apiKey}`);
        console.log(status)
        if (status === 200) {
          const listItem = document.getElementById(`list-item-${taskId}`);
          if (listItem) {
            const parentList = listItem.parentNode;
            parentList.removeChild(listItem);
            this.tasks = this.tasks.filter((task) => task.id !== taskId);
            this.applyItemStyle();
            this.updateTaskCounter();
          }
        }
      } catch (error) {
        window.alert(error);
      }
    },

    applyItemStyle: function () {
      const taskListItems = this.list.querySelectorAll('li');

      taskListItems.forEach((item, index) => {

        const currentIsDark = index % 2 === 0;

        item.classList.remove(this.toggle.checked ? 'BodyMain-list-custom-light' : 'BodyMain-list-custom-dark');
        item.classList.add(`BodyMain-list-custom-${this.toggle.checked ? 'dark' : 'light'}`);

        const bgColor = this.toggle.checked
          ? currentIsDark ? 'var(--background-table-dark-secundary)' : 'var(--background-table-dark-primary)'
          : currentIsDark ? 'var(--background-table-light-secundary)' : 'var(--background-table-light-principal)';

        item.style.backgroundColor = bgColor;
        item.style.color = `var(--text-${this.toggle.checked ? 'white' : 'black'}-list)`;
      });
    },
    bindEvents: function () {

      switch (window.location.pathname) {
        case this.urlLogIn:

          this.logInForm.addEventListener('submit', this.submitLogInForm.bind(this))

          break;

        case this.urlSignUp:

          this.signUpForm.addEventListener('submit', this.submitSignUpForm.bind(this));


          break;

        case this.urlTodo:
          window.addEventListener('DOMContentLoaded', () => {
            const savedDarkMode = localStorage.getItem('darkMode');

            this.toggle.checked = savedDarkMode === 'true';
          });

          this.addButton.addEventListener('click', (event) => {
            event.preventDefault();
            const inputValue = this.input.value.trim();
            if (inputValue !== '') {
              this.addTaskToList(inputValue);
              this.input.value = ''
            }
          });

          this.input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              const inputValue = this.input.value.trim();
              if (inputValue !== '') {
                this.addTaskToList(inputValue);
                this.input.value = ''; // Limpiar el input después de agregar la tarea
              }
            }
          });

          this.toggle.addEventListener('change', (event) => {
            const checked = event.target.checked;

            this.toggleDarkMode();
            localStorage.setItem('darkMode', checked.toString());
          }); 

          break;
      };

    },
    toggleDarkMode: function () {
      const isDarkModeEnabled = this.toggle.checked;
      const bodyClassList = document.body.classList;
      const mainBoxClassList = this.mainBox.classList;
      const headerBoxClassList = this.headerBox.classList;

      if (isDarkModeEnabled) {
        bodyClassList.add('BodyMainDark');
        mainBoxClassList.add('BodyMainDark-dark-main-box');
        headerBoxClassList.add('BodyMainDark-header-box');
      } else {
        bodyClassList.remove('BodyMainDark');
        mainBoxClassList.remove('BodyMainDark-dark-main-box');
        headerBoxClassList.remove('BodyMainDark-header-box');
      }

      this.applyItemStyle();

      this.labelToggle.innerHTML = isDarkModeEnabled ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
      this.labelToggle.style.color = isDarkModeEnabled ? 'var(--orenge-sun)' : 'var(--purple-moon)';

      localStorage.setItem('darkMode', isDarkModeEnabled.toString());
    },
  };

  module.main();
})();