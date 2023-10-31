import {
    fillUsersTable, getRolesForNewUser, createNewUser,
    fillUserForm, updateCurrentUser, deleteCurrentUser,
    fullCurrentUserTable, fillInfo
} from "./a1.js";


window.onload = () => {
    fillUsersTable()
    fullCurrentUserTable()
    fillInfo()
}

$(document).ready(() => {
    //при активации вкладки Нового юзера зполняются роли
    $('.nav-tabs a[href="#NewUser"]').on('show.bs.tab', () => {
        getRolesForNewUser()
        //при нажатии кноки создания нового юзера создаётся юзер
        document.getElementById('createNewUser').addEventListener('click', createNewUser)
    })

    //очистка формы нового юзера
    $('.nav-tabs a[href="#UserTable"]').on('show.bs.tab', () => {
        document.getElementById('formNewUser').reset()
    })

    //заполнение формы редактирования юзера
    $('#modalEdit').off().on('show.bs.modal', event => {
        let id = $(event.relatedTarget).attr("data-index")
        fillUserForm(id, document.forms['modalEditForm'], 'Edit')
        document.getElementById('editUser').addEventListener('click', updateCurrentUser)

    })

    $('#modalDelete').on('show.bs.modal', event => {
        let id = $(event.relatedTarget).attr("data-index")
        fillUserForm(id, document.forms['modalDeleteForm'], 'Delete')
        document.getElementById('closeDeleteModal').addEventListener('click', () => deleteCurrentUser(id))
    })
})