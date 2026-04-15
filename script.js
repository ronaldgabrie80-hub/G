let quizActive = false;
let score = 0;
let questionIndex = 0;

const quiz = [
    {
        q: "Combien font 2 + 2 ?",
        options: ["3", "4", "5"],
        answer: "4"
    },
    {
        q: "Quelle est la capitale de la France ?",
        options: ["Lyon", "Paris", "Marseille"],
        answer: "Paris"
    },
    {
        q: "HTML signifie ?",
        options: ["HyperText Markup Language", "HighText Machine Language", "Hot Mail"],
        answer: "HyperText Markup Language"
    }
];
function startQuiz(){
    quizActive = true;
    score = 0;
    questionIndex = 0;

    addMsg("🎯 Quiz démarré ! Bonne chance", "bot");
    showQuestion();
}
function showQuestion(){
    if(questionIndex >= quiz.length){
        addMsg(`🏁 Quiz terminé ! Score : ${score}/${quiz.length}`, "bot");
        quizActive = false;
        return;
    }

    let q = quiz[questionIndex];

    let div = document.createElement("div");
    div.className = "msg bot";

    div.innerHTML = `<b>${q.q}</b><br><br>`;

    q.options.forEach(opt => {
        let btn = document.createElement("button");
        btn.innerText = opt;
        btn.style.margin = "5px";
        btn.onclick = () => checkAnswer(opt);
        div.appendChild(btn);
    });

    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}
function checkAnswer(choice){
    let q = quiz[questionIndex];

    if(choice === q.answer){
        score++;
        addMsg("✅ Bonne réponse !", "bot");
    } else {
        addMsg("❌ Mauvaise réponse !", "bot");
    }

    questionIndex++;
    setTimeout(showQuestion, 800);
}
function quizMode(){
    startQuiz();
}
let memory = [];
async function send(){
    let input = document.getElementById("input");
    let text = input.value;
    if(!text) return;

    addMsg(text, "user");
    input.value = "";

    // 🔥 on sauvegarde dans la mémoire
    memory.push({role: "user", content: text});

    addMsg("⏳ réflexion...", "bot");

    let response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + API_KEY
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",

            // 🧠 C’EST ÇA QUI REND L’IA INTELLIGENTE
            messages: [
                {
                    role: "system",
                    content: `
Tu es Gabriel IA.
Tu es intelligent, logique, et tu réfléchis avant de répondre.
Tu peux :
- expliquer simplement
- poser des questions
- faire des quiz
- aider l'utilisateur à apprendre

Toujours structurer tes réponses clairement.
`
                },
                ...memory
            ]
        })
    });

    let data = await response.json();

    chat.lastChild.remove();

    let reply = data.choices[0].message.content;

    addMsg(reply, "bot");

    // 🔥 on ajoute la réponse IA à la mémoire aussi
    memory.push({role: "assistant", content: reply});
}
function thinkingMode(){
    memory.push({
        role: "system",
        content: "Mode réflexion activé : répond de façon très logique, étape par étape."
    });

    addMsg("🧠 Mode réflexion activé", "bot");
}
