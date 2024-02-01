const adicionarTarefaBt = document.querySelector('.app__button--add-task')
const formAdicionarTarefa = document.querySelector('.app__form-add-task')
const textarea = document.querySelector('.app__form-textarea')
const ulTarefas = document.querySelector('.app__section-task-list')
const botaoCancelar = document.querySelector('.app__form-footer__button--cancel')
const paragrafoDescricaoTarefa = document.querySelector('.app__section-active-task-description')


const botaoRemoverConcluidas = document.querySelector('#btn-remover-concluidas')
const botaoRemoverTodas = document.querySelector('#btn-remover-todas')

let tarefas = JSON.parse(localStorage.getItem('tarefas')) || []

let tarefaSelecionada = null
let liTarefaSelecionada = null

function atualizarTarefas() {
    localStorage.setItem('tarefas', JSON.stringify(tarefas))

}

function criarElementoTarefa(tarefa) {
    const li = document.createElement('li')
    li.classList.add('app__section-task-list-item')

    const svg = document.createElement('svg')
    svg.classList.add('app__section-task-list-item-description')
    svg.innerHTML = `
   
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
        </svg>
    
        `

    const paragrafo = document.createElement('p')
    paragrafo.classList.add('app__section-task-list-item-description')
    paragrafo.textContent = tarefa.descricao

    const botao = document.createElement('button')
    botao.classList.add('app_button-edit')

    botao.onclick = () => {
        //debugger

        const novaDescricao = prompt("Qual é o novo nome da tarefa?")
        console.log('Nova descrição da tarefa: ', novaDescricao)
        if (novaDescricao) {
            paragrafo.textContent = novaDescricao
            tarefa.descricao = novaDescricao
            atualizarTarefas()

        }

    }

    const imagemBotao = document.createElement('img')


    imagemBotao.setAttribute('src', '/imagens/edit.png')

    botao.append(imagemBotao)

    li.append(svg)
    li.append(paragrafo)
    li.append(botao)
    if (tarefa.completa) {
        li.classList.add('app__section-task-list-item-complete')
        botao.setAttribute('disabled', 'disabled')
    } else {
        li.onclick = () => {
            document.querySelectorAll('.app__section-task-list-item-active')
                .forEach(elemento => {
                    elemento.classList.remove('app__section-task-list-item-active')
                })
            if (tarefaSelecionada == tarefa) {
                paragrafoDescricaoTarefa.textContent = ''
                tarefaSelecionada = null
                liTarefaSelecionada = null
                return
            }
            tarefaSelecionada = tarefa
            liTarefaSelecionada = li
            paragrafoDescricaoTarefa.textContent = tarefa.descricao

            li.classList.add('app__section-task-list-item-active')
        }

    }


    return li
}


adicionarTarefaBt.addEventListener('click', () => {
    formAdicionarTarefa.classList.toggle('hidden')
});
const limparFormulario = () => {
    textarea.value = '';
    formAdicionarTarefa.classList.add('hidden')
}

botaoCancelar.addEventListener('click', limparFormulario)

formAdicionarTarefa.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const descricaoTarefa = textarea.value
    const tarefa = {
        descricao: textarea.value
    }
    tarefas.push(tarefa)
    const elementoTarefa = criarElementoTarefa(tarefa)
    ulTarefas.append(elementoTarefa)
    atualizarTarefas()
    textarea.value = ''
    formAdicionarTarefa.classList.add('hidden')
})





tarefas.forEach(tarefa => {
    const elementoTarefa = criarElementoTarefa(tarefa)
    ulTarefas.append(elementoTarefa)
});

document.addEventListener('FocoFinalizado', () => {
    if (tarefaSelecionada && liTarefaSelecionada) {
        liTarefaSelecionada.classList.remove('app__section-task-list-item-active')
        liTarefaSelecionada.classList.add('app__section-task-list-item-complete')
        liTarefaSelecionada.querySelector('button').setAttribute('disabled', 'disabled')
        tarefaSelecionada.completa = true
        atualizarTarefas()
    }
})


const removerTarefas = (somenteCompletas) => {

    let seletorTarefas = ".app__section-task-list-item"
    if (somenteCompletas) {
        seletorTarefas = ".app__section-task-list-item-complete"

    }

    document.querySelectorAll(seletorTarefas).forEach(elemento => {
        elemento.remove()
    })
    tarefas = somenteCompletas ? tarefas.filter(tarefa => !tarefa.completa) : []
    atualizarTarefas()

}



botaoRemoverTodas.onclick = () => removerTarefas(false)
botaoRemoverConcluidas.onclick = () => removerTarefas(true)