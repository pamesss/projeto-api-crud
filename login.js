//outras funções:
//nome customizado no painel ao fazer login
//design responsivo
//modals para criação e edição de cadastros

//esse bloco de código simula uma operação de login, onde só validamos se o adm (usuário) inseriu um nome
document.querySelector('#login-form').addEventListener('submit', (event) => {    
    //cancela a ação padrão de reiniciar a página ao clicar em "submit" no formulário. permite que eu manipule os dados do formulário como eu desejar
    event.preventDefault(); 

    const adminName = document.querySelector('#admin-name').value;
    if (adminName != "") {
        alert(`Olá ${adminName}. Login autorizado!\nRedirecionando para a tabela de usuários...`);

        //armazena o nome do adm no localStorage do navegador, para poder ser acessado em outras páginas, mesmo após o redirecionamento.
        localStorage.setItem('adminName', adminName); 
        window.location.href = "crud-table.html";
    } else { alert("Login inválido. Por favor tente novamente"); }
});