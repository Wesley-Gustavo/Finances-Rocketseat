const Modal = {
    open(){
        //alert("abrir o modal") "cria uma notificação na tela".
        document
            .querySelector('.modal-overlay')
            .classList.add('active')
    },

    close(){
        document
            .querySelector('.modal-overlay')
            .classList.remove('active')
    }
}

const transactions = [
    {
        description: 'luz',
        ammount: -50000,
        date:'23/01/2021'
    },
    {
        description: 'website',
        ammount: 500000,
        date:'23/01/2021'
    },
    {
        description: 'internet',
        ammount: -20000,
        date:'23/01/2021'
    },
    {
        description: 'App',
        ammount: 200000,
        date:'23/01/2021'
    },
]

const Transactions = {
    all: transactions,

    add(transaction) {
        Transactions.all.push(transaction)

        App.reload()
    },

    Remove(index) {
        Transactions.all.splice(index, 1)
        
        App.reload()
    },

    incomes() {
        let income = 0;

        Transactions.all.forEach(transaction => { // ou (transaction => {})
            
            if(transaction.ammount > 0) {
                
                income = income + transaction.ammount; // ou income += transaction.ammount;
            
            }
        }) 
        return income;
    },

    expenses() {
        let expense = 0;

        Transactions.all.forEach(transaction=> {
            if(transaction.ammount < 0) {
                expense += transaction.ammount;
            }
        })

        return expense;
    },

    total() {
        let total = 0;

        total = Transactions.incomes() + Transactions.expenses()

        return total;
    }
}

let DOM = {
    transactionsContainer: document.querySelector('#transactions-table tbody'),

    addTransaction(transaction, index) {
        let tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction)
        DOM.transactionsContainer.appendChild(tr)
    },

    innerHTMLTransaction(transaction)  {

        let ammount = Utils.formatCurrency(transaction.ammount)

        let CSSClass = transaction.ammount > 0 ? "income" :
        "expense"

        let html = `
            <td class="table-description">${transaction.description}</th>
            <td class="${CSSClass}">${ammount}</th>
            <td class="table-date">${transaction.date}</td>
            <td><img src="./maratona-discover-01-main/assets/minus.svg" alt="Remover Transação"></td>
        `
        return html
    },

    updateBalance(){
        document
            .getElementById('incomes-display')
            .innerHTML = Utils.formatCurrency(Transactions.incomes())
        document
            .getElementById('expense-display')
            .innerHTML = Utils.formatCurrency(Transactions.expenses())
        document
            .getElementById('total-display')
            .innerHTML = Utils.formatCurrency(Transactions.total())
    },

    clearTransaction() {
        DOM.transactionsContainer.innerHTML = ""
    }

}

const Utils = {
    formatCurrency(value){
        let signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g, "")

        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

        return signal + value
    }
}

const App = {
    init(){
        Transactions.all.forEach(transaction => {
            DOM.addTransaction(transaction)
        })

        DOM.updateBalance()

    },

    reload(){
        DOM.clearTransaction()
        App.init()
    },
}

App.init()

//método de adicionar transação

/*Transactions.add({
    description: 'teste',
    ammount: 200,
    date: '23/01/2021'
})*/

//método de remover transação

//Transactions.Remove(3)