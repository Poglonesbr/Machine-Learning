const URL = "./IA/"; // Coloque sua pasta de modelo exportada aqui

let model, maxPredictions;

async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // Carrega o modelo e os metadados
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    document.querySelector(".loading-message").style.display = "none";
    document.getElementById("classify-button").disabled = false;
}

document.getElementById("image-upload").addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.getElementById("image-preview");
            img.src = e.target.result;
            img.classList.remove("hidden");
            document.getElementById("classify-button").disabled = false;
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById("classify-button").addEventListener("click", async () => {
    const img = document.getElementById("image-preview");
    if (!model) {
        alert("O modelo ainda não foi carregado.");
        return;
    }
    const predictions = await model.predict(img);
    displayResults(predictions);
});

function displayResults(predictions) {
    const labelContainer = document.getElementById("label-container");
    labelContainer.innerHTML = "";
    predictions.forEach(prediction => {
        const p = document.createElement("p");
        p.innerText = `${prediction.className}: ${(prediction.probability * 100).toFixed(2)}%`;
        labelContainer.appendChild(p);
    });
}

window.onload = init;