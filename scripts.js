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
        document
            .querySelector('#ErrorMessage')
            .classList.remove('active')
    }
}

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []

    },

    set(Transactions) {
        localStorage.setItem("dev.finances:transactions", JSON.stringify(Transactions))
    }
}

const Transactions = {
    all: Storage.get(),

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
            
            if(transaction.amount > 0) {
                
                income = income + transaction.amount; // ou income += transaction.amount;
            
            }
        }) 
        return income;
    },

    expenses() {
        let expense = 0;

        Transactions.all.forEach(transaction=> {
            if(transaction.amount < 0) {
                expense += transaction.amount;
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

const DOM = {
    transactionsContainer: document.querySelector('#transactions-table tbody'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index

        DOM.transactionsContainer.appendChild(tr)
    },

    innerHTMLTransaction(transaction, index)  {

        const amount = Utils.formatCurrency(transaction.amount)

        const CSSClass = transaction.amount > 0 ? "income" :
        "expense"

        const html = `
            <td class="table-description">${transaction.description}</th>
            <td class="${CSSClass}">${amount}</th>
            <td class="table-date">${transaction.date}</td>
            <td><img onclick="Transactions.Remove(${index})" src="./maratona-discover-01-main/assets/minus.svg" alt="Remover Transação"></td>

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
        const signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g, "")

        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

        return signal + value
    },

    formatAmount(value){
        value = value * 100
        
        return Math.round(value)
    },

    formatDate(date){
        const splitDate = date.split('-')

        return `${splitDate[2]}/${splitDate[1]}/${splitDate[0]}`
    },
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues(){
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    validateField(){
        const {description, amount, date} = Form.getValues()

        if (description.trim() === "" ||
            amount.trim() === "" ||
            date.trim() === "") {
                throw new Error("Todos os campos devem ser preenchidos")
        }

        else {
            document
                .querySelector('#ErrorMessage')
                .classList.remove('active')
        }

    },

    formatValues() {
        let {description, amount, date} = Form.getValues()

        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)

        return {
            description,
            amount,
            date
        }
    },

    clearFields(){
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit(event){
        event.preventDefault()

        Form.formatData
        try {
            Form.validateField()
            const transaction = Form.formatValues()
            Transactions.add(transaction)
            Form.clearFields()
            Modal.close()
        } 
        
        catch (error) {
            //alert (error.message);
            document
                .querySelector('#ErrorMessage')
                .classList.add('active')
        }
    },

}

const App = {
    init(){
        Transactions.all.forEach(DOM.addTransaction)
        

        DOM.updateBalance()

        Storage.set(Transactions.all)
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
    amount: 200,
    date: '23/01/2021'
})*/

//método de remover transação
//Transactions.Remove(3)