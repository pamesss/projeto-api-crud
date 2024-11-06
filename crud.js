//PAINEL DE DADOS DE CLIENTES
//funções:
//chama os users da API e popula a tabela (READ/ GET METHOD)
//opção de cadastrar novos clientes e adicionar na tabela (CREATE/POST METHOD)
//opção de editar as informações clientes cadastrados (UPDATE/PUT METHOD)
//deletar o cadastro de um cliente do servidor (DELETE/DELETE METHOD)

//função que customiza o nome que aparece no painel do administrador
const updateAdminName = () => {
    //utilizando localStorage para recuperar o valor do input do usuário da página anterior
    const adminName = localStorage.getItem('adminName');
    document.getElementById('admin-name').textContent = `${adminName}`;
};
document.addEventListener('DOMContentLoaded', updateAdminName);

//escolhi trabalhar com a API dummyjson porque ele permite simular operações do método GET, POST, PUT e DELETE 
let users = []; //array global que armazena os usuários e permite a manipulação (editar, remover, adicionar) dos seus elementos, simulando as respostas do servidor

//userData é uma função callback que vai passar os dados para outras funções
const data = (userData) => {
    fetch("https://dummyjson.com/users?&select=firstName,lastName,email,password,phone,address,ssn")
        .then(response => response.json())
        .then(data => {
            //guarda os objetos dentro da minha variável global e do meu callback
            users = data.users;
            userData(users);})
        //loga os erros que ocorrerem nessa promise no console
        .catch(error => console.error(error)); 
}

//exibindo os users da API na tabela
const update = (users) => {
    const tbody = document.querySelector("#user-rows");
    tbody.innerHTML = "";
    let idCounter = 0;
    
    users.forEach(user => {
        idCounter++;
        const HTMLrow = `
            <tr id="${user.id}">
                <td class="user-id">${idCounter}</td>
                <td class="user-name">${user.firstName} ${user.lastName}</td>
                <td class="user-email">${user.email}</td>
                <td class="user-password">${user.password}</td>
                <td class="user-phone">${user.phone}</td>
                <td class="user-address">${user.address.address}</td>
                <td class="user-state">${user.address.state}</td>
                <td class="user-cpf">${user.ssn}</td>
                <td><button class="data-button" onclick="editUser(${user.id})" name="${user.id}">Editar</button></td>
                <td><button class="data-button" onClick="deleteUser(this)" name="${user.id}">Deletar</button></td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', HTMLrow);
    });
};
data(update);

//função que cria um novo cadastro e o adiciona na tabela
const toggleModal = (form) => {
    const modal = document.querySelector(form);
    const modalBg = document.querySelector('#modal-opacity');

    modal.classList.toggle('hidden');
    modalBg.classList.toggle('hidden');
};

document.querySelector('#create-btn').addEventListener('click', () => toggleModal("#create-form"));
const create = (event) => {
    event.preventDefault();
    const form = document.querySelector('#create-form');
    const inputs = form.querySelectorAll('input');

    // Verificar se todos os campos estão preenchidos
    for (let input of inputs) {
        if (input.value.trim() === "") {
            alert("Por favor, preencha todos os campos antes de cadastrar um novo usuário.");
            return; //sai da função se algum campo estiver vazio
        }
    }
    const formData = Array.from(inputs).map(input => input.value);
    console.log(formData)
    let newUser = {
        firstName: formData[0],
        lastName: formData[1],
        phone: formData[2],
        ssn: formData[3],
        address: {
            address: formData[4],
            state: formData[5]
        },
        email: formData[6],
        password: formData[7]
    };
    
    toggleModal("#create-form");
    
    fetch('https://dummyjson.com/users/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
    })
    .then(response => response.json())
    .then(newUserData => {
        console.log(newUserData); 
        users.unshift(newUserData);  // adiciona o novo cadastro ao topo da variável global (simulando um POST)
        update(users);
    })
    .catch(error => console.error(error));
};

// função que deleta um cadastro ao clicar no botão correspondente
const deleteUser = (event) => { 
    // transforma a string com o número do id em um número inteiro
    const userId = parseInt(event.getAttribute('name'));

    if (userId >= 209) {
        
        const index = users.findIndex(user => user.id === userId);
        if (index !== -1) {
            confirm(`Você está deletando o cadastro de ${users[index].firstName + " " + users[index].lastName}. \nConfirma essa ação?
            \n*OBS: ESSA AÇÃO NÃO É REVERSÍVEL`);
            users.splice(index, 1);
        }

        // Remove o usuário da tabela
        document.getElementById(userId).remove();
    } else {
        if (confirm(`Você está deletando o cadastro de ${users[userId - 1].firstName + " " + users[userId - 1].lastName}. \nConfirma essa ação?
        \n*OBS: ESSA AÇÃO NÃO É REVERSÍVEL`)) {
            fetch(`https://dummyjson.com/users/${userId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            })
            .then(res => res.json())
            .then(data => {
                const index = users.findIndex(user => user.id === userId);
                if (index !== -1) {
                    users.splice(index, 1);
                }
                update(users);
            })
            .catch(error => console.error(error));
        }
    }
};

//função de editar as informações de clientes cadastrados
const editUser = (userId) => {
    const user = users.find(user => user.id === userId);

    const form = document.querySelector('#edit-form');
    const inputs = form.querySelectorAll('input');
    
    inputs[0].value = user.firstName;
    inputs[1].value = user.lastName;
    inputs[2].value = user.phone;
    inputs[3].value = user.ssn;
    inputs[4].value = user.address.address;
    inputs[5].value = user.address.state;
    inputs[6].value = user.email;
    inputs[7].value = user.password;

    toggleModal('#edit-form');

    form.onsubmit = (event) => {
        event.preventDefault();
    
        // Verificar se todos os campos estão preenchidos
        for (let input of inputs) {
            if (input.value.trim() === "") {
                alert("Por favor, preencha todos os campos antes de salvar as alterações.");
                return; // sai da função se algum campo estiver vazio
            }
        }
    
        const updatedUser = {
            firstName: inputs[0].value,
            lastName: inputs[1].value,
            phone: inputs[2].value,
            ssn: inputs[3].value,
            address: {
                address: inputs[4].value,
                state: inputs[5].value
            },
            email: inputs[6].value,
            password: inputs[7].value
        };    

        fetch(`https://dummyjson.com/users/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedUser)
        })
        .then(response => response.json())
        .then(data => {
            // Update the user array with the new data
            const index = users.findIndex(user => user.id === userId);
            if (index !== -1) {
                users[index] = data; // Update the specific user in the array
            }
            // Update the table display
            update(users);
            toggleModal('#edit-form');
        })
        .catch(error => console.error(error));
    };
};