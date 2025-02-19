const btn_chave = document.querySelector("#btn-chave");
const btn_proto = document.querySelector("#btn-proto");
const btnContext = document.querySelector("#btnContext");
const btncontabil = document.querySelector("#btncontabil");
const btnplanejamento = document.querySelector("#btnplanejamento");
const btntesouraria = document.querySelector("#btntesouraria");
const btnsaldoinicial = document.querySelector("#btnsaldoinicial");
const btnescsaldoinicial = document.querySelector("#btnescsaldoinicial");
const btnjiraconclusao = document.querySelector("#btnjiraconclusao");


// const db = require("../data/db.json");

const getDadosSistema = () => {
  let url = window.location.href;
  let [_a, _b, sistema, _d, _e, entity] = url.split("/");
  let system = [
    "tesouraria.betha.cloud",
    "planejamento.betha.cloud",
    "contabil.betha.cloud",
    "esocial.betha.cloud",
    "scripts.plataforma.betha.cloud",
    "folha.betha.cloud",
    "prestacao-contas.betha.cloud",
    "obras.betha.cloud",
    "patrimonio.betha.cloud",
    "convenios.betha.cloud",
    "monitor-dfe.betha.cloud",
    "contabil-release.test.betha.cloud",
    "planejamento-release.test.betha.cloud",
    "tesouraria-release.test.betha.cloud",
    "contabil.test.betha.cloud",
    "planejamento.test.betha.cloud",
    "tesouraria.test.betha.cloud",
  ];
  if (system.includes(sistema)) {
    alert(atob(entity));
  }
};


const excluirSaldoInicial = () => {
  let url = window.location.href.split("/");

  for (let it of url.reverse()) {
    if ("saldos-iniciais" === it) {
      let confirmacao = confirm(
        "Iniciando exclusão dos saldos iniciais...\nTem certeza de que deseja continuar?"
      );

      if (confirmacao) {
        // Executar clique nos ícones de exclusão apenas se o usuário confirmar
        document
          .querySelectorAll('[class="fa fa-trash-o fa-fw"]')
          .forEach((item) => {
            item.click();
          });
      } else {
        alert("Exclusão cancelada pelo usuário.");
      }
      break; // Parar o loop após encontrar a URL correta
    }
  }
};

async function getConsultaExecucao(chv) {
  chrome.tabs.create({
    url: `https://consulta-execucoes.plataforma.betha.cloud/#/${chv}`,
  });
}

async function getChaveAcesso(chv) {
  chrome.tabs.create({
    url: `https://plataforma-oauth.betha.cloud/auth/oauth2/tokeninfo?access_token=${chv}`,
  });
}

btn_chave.addEventListener("click", async (env) => {
  const chaveAcesso = document.querySelector("#chaveAcesso").value || undefined;
  if (chaveAcesso !== undefined) {
    await getChaveAcesso(chaveAcesso);
  }
});

btn_proto.addEventListener("click", async (env) => {
  const consultaExecucao =
    document.querySelector("#consultaExecucao").value || undefined;
  if (consultaExecucao !== undefined) {
    await getConsultaExecucao(consultaExecucao);
  }
});

btnContext.addEventListener("click", async (env) => {
  env.preventDefault();
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: getDadosSistema,
  });
  window.close();
});

btncontabil.addEventListener("click", () => {
  chrome.tabs.create({
    url: `https://swagger.betha.cloud/?configUrl=https://52sn0onf7i.execute-api.us-east-1.amazonaws.com/prod/apiDocumentation?grupo%3Dservice-layer-contabil#`,
  });
});

btnplanejamento.addEventListener("click", () => {
  chrome.tabs.create({
    url: `https://swagger.betha.cloud/?configUrl=https://52sn0onf7i.execute-api.us-east-1.amazonaws.com/prod/apiDocumentation?grupo%3Dservice-layer-planejamento#`,
  });
});

btntesouraria.addEventListener("click", () => {
  chrome.tabs.create({
    url: `https://swagger.betha.cloud/?configUrl=https://52sn0onf7i.execute-api.us-east-1.amazonaws.com/prod/apiDocumentation?grupo%3Dservice-layer-tesouraria#`,
  });
});

btnsaldoinicial.addEventListener("click", async (env) => {
  env.preventDefault();
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: excluirSaldoInicial,
  });
  window.close();
});


btnescsaldoinicial.addEventListener("click", async (env) => {
  env.preventDefault();
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: () => {
      let url = window.location.href.split("/");
      for (let it of url.reverse()) {
        if (["saldos-iniciais","lancamentos-abertura"].includes(it)) {
          console.log("URL identificada, iniciando processamento...");
          let botoesEditar = document.querySelectorAll('.fa.fa-pencil.fa-fw');
          console.log("Botões encontrados:", botoesEditar.length);
          async function processarItens() {
            for (let item of botoesEditar) {
              item.click();
              await new Promise(resolve => setTimeout(resolve, 500));
              let botaoSalvar = document.querySelector('#btnSaldosIniciaisItensCadEscriturar');
              if (botaoSalvar) {
                botaoSalvar.click();
              }else {
                botaoSalvar = document.querySelector('#btnLancamentosContabeisCadEscriturar');
                if(botaoSalvar){
                  botaoSalvar.click();
                }else{
                  console.warn("Botão de salvar não encontrado!");
                }
              }
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }
          processarItens();
          break;
        }
      }
    },
  });
  window.close();
});

btnjiraconclusao.addEventListener('click', async (env) => {
  env.preventDefault();
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: () => {
      let url = window.location.href.split("/");
      let isJIRA = url.includes('desenv.betha.com.br')
      if(!isJIRA) return ;
      let textarea = document.querySelector('[class="textarea long-field wiki-textfield"]')
      if(!textarea) return ;
      textarea.value = `Bom dia, 

Orquestração realizada conforme solicitado.

Atenciosamente,
*Desenvolvimento - Vertical Contábil*`
    }
  });
  window.close();
})

