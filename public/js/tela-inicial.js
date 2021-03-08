//Adicionar e remover linhas
const table = document.getElementById("calculos");
const tbody = document.getElementById("corpo-tabela");
const draggable = document.querySelectorAll(".draggable");
let id = 1;

function adicionarLinha(botaoAdionar) {
    let celula = botaoAdionar.parentNode.parentNode;
    let filhosTd = [...celula.childNodes];
    let extrato = [...filhosTd[1].childNodes];
    let extratoAnterior = extrato[0].value;
    let tr = `
    <tr id="linha${id}" class="draggable" draggable="true">
        <td><input type="text" id="extrato-${id}" name="extrato" class="form-control" required></td>
        <td><input type="text" id="data-${id}" name="data" class="form-control data" required></td>
        <td>
            <select name="codigo" class="form-control">
                <option>001</option>
                <option>002</option>
                <option>003</option>
            </select>
        </td>
        <td><span>Aqui vai a descrição</span></td>
        <td><span>Aqui vai a observação</span></td>
        <td><input type="text" id="dinheiro-${id}" name="valor" class="form-control dinheiro" required></td>
        <td><span>Aqui vai o saldo</span></td>
        <td style="text-align: center"><button type="button" onclick="adicionarLinha(this)">+</button></td>
        <td style="text-align: center"><button type="button" onclick="apagarLinha(this)">-</button></td>
    </tr>
    `;
    //$(tr).insertAfter($(celula));
    $(tbody).append(tr);
    $(`#data-${id}`).mask("00/00/0000");
    $(`#dinheiro-${id}`).mask("000.000.000.000.000,00", { reverse: true });
    $(`#extrato-${id}`).val(extratoAnterior);

    id++;
}

function apagarLinha(linha) {
    let pai = linha.parentNode.parentNode;
    pai.parentNode.removeChild(pai);
}

//Adiciona os listeners de movimento em uma linha.
function adicionarListeners(linha) {
    linha.addEventListener("dragstart", () => {
        linha.classList.add("dragging");
    });
    linha.addEventListener("dragend", () => {
        linha.classList.remove("dragging");
    });
}
//Adiciona o listener de movimento em todas as linhas(é chamado no começo da execução).
draggable.forEach((movel) => {
    adicionarListeners(movel);
});

//Captura e trata os movimentos das linhas
tbody.addEventListener("dragover", (e) => {
    e.preventDefault();
    const proximoElemento = getDragAfterElement(tbody, e.clientY);
    const movendo = document.querySelector(".dragging");
    if (proximoElemento == null) {
        //tbody.append(movendo);
    } else {
        tbody.insertBefore(movendo, proximoElemento);
    }
});

//Retorna o elemento mais próximo do que está em movimento
function getDragAfterElement(container, y) {
    //Retorna uma lista com todos os elementos da classe ddraggable que não sejam da classe dragging.
    //Ou seja, que podem se mover, mas não estão em movimento.
    const draggableElements = [
        ...container.querySelectorAll(".draggable:not(.dragging)"),
    ];
    return draggableElements.reduce(
        (closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        },
        { offset: Number.NEGATIVE_INFINITY }
    ).element;
}

//Configuração de máscaras
function adicionarMascaras() {
    $(".data").mask("00/00/0000");
    $(".dinheiro").mask("000.000.000.000.000,00", { reverse: true });
}

adicionarMascaras();

$("#form").submit(function (evt) {
    evt.preventDefault();
});