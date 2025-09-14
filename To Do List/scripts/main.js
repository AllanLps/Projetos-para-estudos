// esse bloco busca elementos do DOM e guarda em variáveis
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const tasksList = document.getElementById("tasks");
const message = document.getElementById("message");

// proteção caso algum elemento não exista
if (!taskForm || !taskInput || !tasksList || !message) {
  console.error(
    "Elementos do DOM não encontrados. Verifique ids em index.html"
  );
}

// essa variável lê o JSON salvo no localStorage, na chave tasks_v1 e se não existir, cria um array vazio, funciona como se fosse um banco de dados simples
//Resultado é um array de objetos (id, text, done)
let tasks = JSON.parse(localStorage.getItem("task_storage") || "[]");

//essa função salva o array tasks no localStorage, ela seta a chave task_storage com o valor do array convertido para JSON
function saveTasks() {
  localStorage.setItem("task_storage", JSON.stringify(tasks));
}

//aqui basicamente mostra ou esconde a mensagem "nenhuma tarefa", se o array tasks estiver vazio, mostra a mensagem, se tiver algo, esconde
function updateMessageVisibility() {
  message.style.display = tasks.length === 0 ? "block" : "none";
}

//essa função renderiza a lista de tarefas na tela
function renderTasks() {
  // limpa a lista antes de renderizar
  tasksList.innerHTML = "";
  // para cada tarefa no array tasks, cria um elemento li com checkbox, texto e botão de excluir
  for (const task of tasks) {
    const li = document.createElement("li");
    // adiciona classe 'done' se a tarefa estiver marcada como feita
    li.className = "task-item" + (task.done ? " done" : "");
    // guarda o id da tarefa no dataset do li
    li.dataset.id = task.id;
    // cria checkbox e define se está marcado ou não
    const checkbox = document.createElement("input");
    //passa o tipo checkbox
    checkbox.type = "checkbox";
    //Define o estado visual do checkbox, marcado se task.done for true, senão desmarcado
    checkbox.checked = task.done;
    //adiciona um listener para quando o estado do checkbox mudar, chama a função toggleTask passando o id da tarefa e o novo estado (checked)
    checkbox.addEventListener("change", (e) =>
      toggleTask(task.id, e.target.checked)
    );
    // cria span para o texto da tarefa
    const span = document.createElement("span");
    //define o span como text
    span.className = "text";
    //Define o conteúdo do span como o texto da tarefa
    span.textContent = task.text;

    // botão com SVG inline (ícone estilo Lucide - sem dependência externa)
    //constant que cria o botão de deletar
    const btnDel = document.createElement("button");
    //adiciona classe, tipo, label e o conteúdo SVG do botão
    btnDel.className = "btn-delete";
    btnDel.type = "button";
    btnDel.setAttribute("aria-label", "Excluir tarefa");
    btnDel.innerHTML = `
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
        <path d="M10 11v6"></path>
        <path d="M14 11v6"></path>
        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
      </svg>
    `;
    //escuta o clique no botão e chama a função deleteTask passando o id da tarefa
    btnDel.addEventListener("click", () => deleteTask(task.id));
    // adiciona checkbox, span e botão ao li
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(btnDel);
    // adiciona o li à lista ul
    tasksList.appendChild(li);
  }
  // atualiza a visibilidade da mensagem ("nenhuma tarefa")
  updateMessageVisibility();
}

//essa função adiciona uma nova tarefa ao array tasks, recebe o texto da tarefa como parâmetro
function addTask(text) {
  //remove espaços em branco do início e fim do texto
  const newTask = text.trim();
  //se o texto estiver vazio, não faz nada
  if (!newTask) return;
  //cria um objeto tarefa com id único (timestamp), texto e done como false
  const task = { id: Date.now().toString(), text: newTask, done: false };
  //inserer a nova tarefa no início do array
  tasks.unshift(task);
  //salva o array atualizado no localStorage
  saveTasks();
  //re-renderiza a lista de tarefas na tela
  renderTasks();
}

// essa função alterna o estado de uma tarefa (feito/não feito), recebe o id da tarefa e opcionalmente o estado 'done'
function toggleTask(id, done) {
  //procura a tarefa no array pelo id
  const t = tasks.find((x) => x.id === id);
  //se não encontrar, sai da função
  if (!t) return;
  // se 'done' for boolean, usa esse valor, senão inverte o estado atual
  t.done = typeof done === "boolean" ? done : !t.done;
  saveTasks();
  renderTasks();
}

// essa função exclui uma tarefa do array pelo id
function deleteTask(id) {
  //procura a tarefa no array pelo id, remove do array se encontrar
  tasks = tasks.filter((x) => x.id !== id);
  //salva o array atualizado no localStorage
  saveTasks();
  //re-renderiza a lista de tarefas na tela
  renderTasks();
}

// escuta o envio do formulário, previne o comportamento padrão (recarregar a página), chama addTask com o valor do input, limpa o input e foca nele
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addTask(taskInput.value);
  taskInput.value = "";
  taskInput.focus();
});

// renderiza a lista de tarefas ao carregar o script
renderTasks();
