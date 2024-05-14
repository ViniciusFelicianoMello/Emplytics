// Dados iniciais
let users = [];
let editingUserId = null;

// Funções auxiliares
const getUserFormData = () => ({
    name: document.getElementById("name").value,
    age: parseInt(document.getElementById("age").value),
    email: document.getElementById("email").value,
    salary: parseFloat(document.getElementById("salary").value)
});

const clearUserFormData = () => {
    document.getElementById("name").value = '';
    document.getElementById("age").value = '';
    document.getElementById("email").value = '';
    document.getElementById("salary").value = '';
};

// Manipulação do modal
const openModal = (title, userId = null) => {
    document.getElementById("modalTitle").innerText = title;
    document.getElementById("userModal").style.display = "block";
    if (userId !== null) {
        editingUserId = userId;
        const user = users.find(u => u.id === userId);
        document.getElementById("name").value = user.name;
        document.getElementById("age").value = user.age;
        document.getElementById("email").value = user.email;
        document.getElementById("salary").value = user.salary;
    }
};

const closeModal = () => {
    document.getElementById("userModal").style.display = "none";
    clearUserFormData();
    editingUserId = null;
};

// Manipulação de usuários
const addUser = (user) => {
    user.id = Date.now(); // Usar o tempo atual como ID único
    users.push(user);

    saveUsersToLocalStorage(); // Salva usuários no localStorage
    renderTable();
};

const editUser = (userId, updatedUser) => {
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1) {
        users[index] = { ...users[index], ...updatedUser };

        saveUsersToLocalStorage(); // Salva usuários no localStorage
        renderTable();
    }
};

// Renderizar a tabela com os dados dos usuários
const renderTable = () => {
    const tbody = document.getElementById("userTable").querySelector("tbody");
    tbody.innerHTML = "";

    const filteredUsers = filterUsers(users, document.getElementById("searchInput").value);
    const sortedUsers = sortUsers(filteredUsers, document.getElementById("sortSelect").value);

    sortedUsers.forEach(user => {
        const row = document.createElement("tr");

        // Nome
        const nameCell = document.createElement("th");
        nameCell.innerText = user.name;
        row.appendChild(nameCell);
        
        // Idade
        const ageCell = document.createElement("th");
        ageCell.innerText = user.age;
        row.appendChild(ageCell);

        // Email
        const emailCell = document.createElement("th");
        emailCell.innerText = user.email;
        row.appendChild(emailCell);

        // Salário
        const salaryCell = document.createElement("th");
        salaryCell.innerText = user.salary;
        row.appendChild(salaryCell);

        // Ações (Editar/Deletar)
        const actionsCell = document.createElement("td");

        // Botão de editar
        const editButton = document.createElement("button");
        editButton.innerHTML = '<i class="fa-solid fa-pen actions_btn edit_icon"></i>';
        editButton.addEventListener("click", () => openModal("Editar Funcionário", user.id));
        actionsCell.appendChild(editButton);

        // Botão de deletar
        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = '<i class="fa-solid fa-trash-can actions_btn delet_icon"></i>';
        deleteButton.addEventListener("click", () => deleteUser(user.id));
        actionsCell.appendChild(deleteButton);

        row.appendChild(actionsCell);

        tbody.appendChild(row);
    });
};

// Filtros e ordenação
const filterUsers = (users, searchText) => {
    return users.filter(user => user.name.toLowerCase().includes(searchText.toLowerCase()));
};

const sortUsers = (users, sortOption) => {
    return users.sort((a, b) => {
        if (sortOption === "asc") {
            return a.salary - b.salary;
        } else if (sortOption === "desc") {
            return b.salary - a.salary;
        }
        return 0;
    });
};

// Função para salvar usuários no localStorage
const saveUsersToLocalStorage = () => {
    localStorage.setItem("users", JSON.stringify(users));
};

// Função para carregar usuários do localStorage
const loadUsersFromLocalStorage = () => {
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) {
        users = JSON.parse(storedUsers);
    }
    renderTable(); // Atualiza a tabela após carregar usuários
};

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
    // Carregar usuários do localStorage ao carregar a página
    loadUsersFromLocalStorage();

    // Manipuladores de eventos
    document.getElementById("addUserBtn").addEventListener("click", () => openModal("Adicionar Funcionário"));
    document.getElementById("userForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const userData = getUserFormData();
        
        if (editingUserId) {
            editUser(editingUserId, userData);
        } else {
            addUser(userData);
        }

        closeModal();
    });

    document.getElementById("sortSelect").addEventListener("change", renderTable);
    document.getElementById("searchInput").addEventListener("input", renderTable);
    document.querySelector(".close").addEventListener("click", closeModal);

    // Renderizar a tabela inicialmente
    renderTable();
});



//deletar usuario
const deleteUser = (userId) => {
    openConfirmDeleteModal(userId);
};

// Variável para armazenar o ID do usuário a ser deletado
let userIdToDelete = null;

// Função para abrir o modal de confirmação de exclusão
const openConfirmDeleteModal = (userId) => {
    document.getElementById("confirmDeleteModal").style.display = "block";
    userIdToDelete = userId;
};

// Função para fechar o modal de confirmação de exclusão
const closeConfirmDeleteModal = () => {
    document.getElementById("confirmDeleteModal").style.display = "none";
    userIdToDelete = null;
};

// Manipuladores de eventos para o modal de confirmação de exclusão
document.getElementById("confirmDeleteBtn").addEventListener("click", () => {
    // Realize a exclusão do usuário
    if (userIdToDelete !== null) {
        users = users.filter(u => u.id !== userIdToDelete);
        saveUsersToLocalStorage(); // Salva usuários no localStorage
        renderTable();
    }
    closeConfirmDeleteModal();
});

document.getElementById("cancelDeleteBtn").addEventListener("click", () => {
    closeConfirmDeleteModal();
});

document.querySelector(".closeConfirmDelete").addEventListener("click", () => {
    closeConfirmDeleteModal();
});
