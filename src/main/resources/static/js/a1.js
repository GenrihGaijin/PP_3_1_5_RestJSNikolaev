const url = 'http://localhost:8080/api/'

//функция отправки запроса для получения JSON
function fetchJSON(url) {
    return fetch(url).then(response => response.json());
}

//функция для получения ролей пользователя
async function fetchRolesData() {
    return await fetchJSON(url + 'admin/roles');
}

//функция для получения данных о пользователе по ID
async function fetchUserData(id) {
    return await fetchJSON(url + 'admin/' + id);
}

//функция заполнения главной таблицы юзеров
export function fillUsersTable() {
    const allUsersTableBody = document.getElementById('allUsersTableBody')
    $('#allUsersTableBody').empty()
    fetchJSON(url + 'admin')
        .then(data => {
            allUsersTableBody.innerHTML = data.map(createRow).join('');
        })
}

//Функция заполнения заголовка
export function fillInfo() {
    const header = document.getElementById('superInformation')
    fetchJSON(url + 'user/info')
        .then(data => {
                header.innerHTML = 'USERNAME: ' + data.name + ' WITH ROLES: ' + data.roles.map(el => el.role.substring(5))
            }
        )
}

//функция заполнения таблица текущего юзера
export async function fullCurrentUserTable() {
    const currentUserTableBody = document.getElementById('currentUserTableBody');
    try {
        fetchJSON(url + 'user/info')
            .then(data => {
                renderUserTable(currentUserTableBody, data);
            })
    } catch (error) {
        console.error(error);
    }
}


//функция выбора ролей для нового юзера
export async function getRolesForNewUser() {
    const selectRolesForNewUser = document.getElementById('selectRolesForNewUser');

    try {
        const response = await fetch(url + 'admin/roles');
        if (!response.ok) {
            console.log('Failed to fetch roles')
        }

        const data = await response.json();
        selectRolesForNewUser.innerHTML = createRoleOptions(data);
    } catch (error) {
        console.error(error);
    }
}



//функция создания нового юзера
export async function createNewUser(e) {
    e.preventDefault();
    const newUserForm = document.forms['formNewUser'];
    const newUserRoles = getSelectedRoles();
    const userData = {
        name: newUserForm.firstname.value,
        lastName: newUserForm.lastname.value,
        age: newUserForm.age.value,
        email: newUserForm.email.value,
        username: newUserForm.username.value,
        password: newUserForm.password.value,
        roles: newUserRoles
    };

    try {
        const response = await createUser(userData);
        if (response.ok) {
            newUserForm.reset();
            fillUsersTable();
            $('.nav-tabs a[href="#UserTable"]').tab('show');
        }
    } catch (error) {
        console.error(error);
    }
}

//функция отпраки запросв на создание юзера
async function createUser(userData) {
    return fetch(url + 'admin/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    });
}


//функция заполнения форм (редактирования, удаления)
export async function fillUserForm(id, formName, method) {
    try {
        const [userData, rolesData] = await Promise.all([fetchUserData(id), fetchRolesData()]);

        formName.id.value = userData.id;
        formName.lastname.value = userData.lastName;
        formName.firstname.value = userData.name;
        formName.username.value = userData.username;

        const userRolesId = userData.roles.map(role => role.id);
        const rolesForEditedUser = document.getElementById('roles' + method);
        rolesForEditedUser.innerHTML = createRoleOptions(rolesData, userRolesId);
    } catch (error) {
        console.error(error);
    }
}

//функция редактирования юзера
export function updateCurrentUser(e) {
    e.preventDefault()
    let editUserRoles = []
    for (let option of document.getElementById('rolesEdit').options) {
        if (option.selected) {
            editUserRoles.push({
                id: option.value, role: option.innerText
            })
        }
    }
    let userEditForm = document.forms['modalEditForm']
    fetch(url + 'admin', {
        method: 'PUT', headers: {
            'Content-Type': 'application/json'
        }, body: JSON.stringify({
            id: userEditForm.id.value,
            name: userEditForm.firstname.value,
            lastName: userEditForm.lastname.value,
            age: userEditForm.age.value,
            email: userEditForm.email.value,
            username: userEditForm.username.value,
            password: userEditForm.password.value,
            roles: editUserRoles
        })
    }).then((response) => {
        if (response.ok) {
            fillUsersTable()
            userEditForm.password.value = ''
            document.getElementById('closeEditModalWindow').click()
            $('.nav-tabs a[href="#UserTable"]').tab('show')
        }
    })
}

//функция удаления юзера
export function deleteCurrentUser(id) {
    fetch(url + 'admin/' + id, {
        method: 'DELETE'
    }).then(() => {
        fillUsersTable()
        $('.nav-tabs a[href="#UserTable"]').tab('show')
    })
}


//функция наполнения html для всех списка юзеров. Смотрите метод - fillUsersTable
function createRow(element) {
    return `<tr>
                    <td>${element.id}</td>
                    <td>${element.name}</td>
                    <td>${element.lastName}</td>
                    <td>${element.age}</td>
                    <td>${element.email}</td>
                    <td>${element.username}</td>
                    <td>${element.roles.map(el => el.role.substring(5))}</td>
                    <td>
                     <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-index="${element.id}"
                        data-bs-target="#modalDelete" id="buttonDelete">Delete</button>
                    </td>
                    <td>
                      <button type="button" id="buttonEdit" class="btn btn-info" data-bs-toggle="modal"
                       data-index="${element.id}"  data-bs-target="#modalEdit">Edit</button>
                    </td>
                    <td>
                    </td>
                </tr>`;
}

function updateUserInfo(data) {
    document.querySelector('header div h1').innerHTML = `${data.username} User roles: ${getFormattedRoles(data.roles)}`;
    document.getElementById("currentUserLoginInUser").innerHTML = data.username;
}


//функция для форматирования ролей - ROLE_AADMIN = ADMIN
function getFormattedRoles(roles) {
    return roles.map(role => role.role.substring(5)).join(' ');
}

//функция наполнения html для текущего юзера. Смотрите метод - fullCurrentUserTable
function renderUserTable(tableBody, data) {
    const { id, name, lastName, username, roles } = data;
    tableBody.innerHTML = `
        <tr>
            <td>${id}</td>
            <td id="name${id}">${name}</td>
            <td id="lastname${id}">${lastName}</td>
            <td id="username${id}">${username}</td>
            <td id="role${id}">${getFormattedRoles(roles)}</td>
        </tr>
    `;
}

//функция наполнения ролей
function createRoleOptions(roles) {
    return roles.map(role => {
        const selected = role.id === 2 ? 'selected' : '';
        return `
            <option value="${role.id}" ${selected}>
                ${role.role.substring(5)}
            </option>
        `;
    }).join('');
}


//получение выбранных ролей
function getSelectedRoles() {
    const selectRolesForNewUser = document.getElementById('selectRolesForNewUser');
    const newUserRoles = [];

    for (let option of selectRolesForNewUser.options) {
        if (option.selected) {
            newUserRoles.push({
                id: option.value,
                role: option.innerText
            });
        }
    }
    console.log(newUserRoles)
    return newUserRoles;
}







