let memory = JSON.parse(localStorage.getItem("jarvisMemory")) || {};

function addMessage(text, type){
let div = document.createElement("div");
div.classList.add("msg", type);
div.innerText = text;
document.getElementById("chatBox").appendChild(div);
}

// 🧠 SAVE MEMORY
function saveMemory(key, value){
memory[key] = value;
localStorage.setItem("jarvisMemory", JSON.stringify(memory));
document.getElementById("memoryBox").innerText =
JSON.stringify(memory, null, 2);
}

// 🤖 SEND MESSAGE TO AI
async function sendMessage(){

let input = document.getElementById("userInput");
let text = input.value;
if(!text) return;

addMessage(text, "user");
input.value = "";

saveMemory("lastMessage", text);

let reply = await getAI(text);
addMessage(reply, "bot");
}

// 🤖 GEMINI AI
async function getAI(prompt){

try {

const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAj4mwHOade4mbhJmts_Pz0w7MdWhcr9Bc", {
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({
contents:[{parts:[{text:prompt}]}]
})
});

const data = await res.json();
return data.candidates?.[0]?.content?.parts?.[0]?.text || "NO RESPONSE";

} catch {
return "AI OFFLINE";
}
}

// 🎮 COMMAND SYSTEM (IRON MAN STYLE)
function runCommand(){

let cmd = document.getElementById("commandInput").value.toLowerCase();

if(cmd.includes("memory")){
addMessage(JSON.stringify(memory, null, 2), "bot");
}

else if(cmd.includes("clear")){
document.getElementById("chatBox").innerHTML = "";
}

else if(cmd.includes("status")){
addMessage("ALL SYSTEMS ONLINE ⚡", "bot");
}

else if(cmd.includes("hello")){
addMessage("HELLO USER. JARVIS ONLINE.", "bot");
}

else {
addMessage("UNKNOWN COMMAND ❌", "bot");
}
}

// 🎤 VOICE INPUT
function startVoice(){

let speech = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
speech.lang = "en-US";

speech.onresult = function(e){
document.getElementById("userInput").value =
e.results[0][0].transcript;
sendMessage();
};

speech.start();
}

// load memory on start
document.getElementById("memoryBox").innerText =
JSON.stringify(memory, null, 2);