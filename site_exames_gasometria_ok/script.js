
const exames = [
  { label: "Hb", regex: /Hemoglobina:\s*([\d,]+)/i },
  { label: "Plaq", regex: /PLAQUETAS:?\s*([\d\.]+)/i },
  { label: "Ht", regex: /Hemat[óo]crito:?\s*([\d,]+)/i },
  { label: "Leuco", regex: /Leuc[óo]citos:?\s*([\d\.]+)/i },
  { label: "Neut", regex: /Segmentados:?\s*([\d,]+)/i, percentual: true },
  { label: "Linf", regex: /Linf[óo]citos:?\s*([\d,]+)/i, percentual: true },
  { label: "Mon", regex: /Mon[óo]citos:?\s*([\d,]+)/i, percentual: true },
  { label: "Eos", regex: /Eosin[óo]filos:?\s*([\d,]+)/i },
  { label: "Bas", regex: /Bas[óo]filos:?\s*([\d,]+)/i },
  { label: "Ur", regex: /UR[ÉE]IA[^\d]*([\d,]+)/i },
  { label: "Cr", regex: /CREATININA[^\d]*([\d,]+)/i },
  { label: "Na", regex: /S[ÓO]DIO[^\d]*([\d,]+)/i },
  { label: "K", regex: /POT[ÁA]SSIO[^\d]*([\d,]+)/i },
  { label: "pH", regex: /pH\s*[:\-\s]*([\d,]+)/i },
  { label: "PaCO₂", regex: /pCO2\s*[:\-\s]*([\d,]+)/i },
  { label: "PaO₂", regex: /pO2\s*[:\-\s]*([\d,]+)/i },
  { label: "HCO₃⁻", regex: /HCO3[-−]?\s*[:\-\s]*([\d,]+)/i },
  { label: "BE", regex: /Excesso\s+de\s+base\s*[:\-\s]*([\-\d,]+)/i },
  { label: "SatO₂", regex: /Sat(?:\.\s*da\s*Hb|uraç[aã]o)?\s*[:\-\s]*([\d,]+)/i }
];

function formatarValor(valorStr) {
  return valorStr.replace(",", ".");
}

function calcularAbsoluto(porcentagem, total) {
  const pct = parseFloat(porcentagem.replace(",", "."));
  return Math.round((pct / 100) * total);
}

document.getElementById("gerar").onclick = () => {
  const texto = document.getElementById("input").value;
  const resultados = [];
  let leuco = null;

  const leucoMatch = texto.match(/Leuc[óo]citos:?\s*([\d\.]+)/i);
  if (leucoMatch) leuco = parseInt(leucoMatch[1].replace(".", ""));

  exames.forEach(e => {
    const m = texto.match(e.regex);
    if (m) {
      const valor = formatarValor(m[1]);
      if (["Neut", "Linf", "Mon"].includes(e.label) && leuco) {
        const absoluto = calcularAbsoluto(valor, leuco);
        resultados.push(`${e.label} ${absoluto}`);
      } else {
        resultados.push(`${e.label} ${valor}`);
      }
    }
  });

  const hoje = new Date().toLocaleDateString("pt-BR");
  const linha = `Labs ${hoje}: ` + resultados.join(" | ");
  document.getElementById("resumo").textContent = linha;
};

document.getElementById("copiar").onclick = () => {
  navigator.clipboard.writeText(document.getElementById("resumo").textContent)
    .then(() => alert("Resumo copiado!"));
};
