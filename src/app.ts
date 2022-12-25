const form = document.querySelector<HTMLFormElement>("form");
const ageInput = document.querySelector<HTMLInputElement>("#age");
const themesInput = document.querySelector<HTMLInputElement>("#themes");
const submitButton = document.querySelector<HTMLButtonElement>("button");
const footer = document.querySelector<HTMLElement>("footer");

const token = "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";
const generatePromptByAgeAndThemes = (choix: string, mot = "") => {
  // let prompt = `Propose moi, avec un ton joyeux et amical, 5 idées de cadeau pour une personne âgée de ${age} ans`;
  let prompt = `Donne moi quelques exemples de ${choix} du mot ${mot}`;

  if (!mot.trim()) {
    // prompt += ` et qui aime ${themes}`;
    console.log("erreur");
  }
  return prompt + " !";
};

const setLoadingItems = () => {
  footer!.textContent = "Chargement de mots en cours !";
  footer!.setAttribute("aria-busy", "true");
  submitButton?.setAttribute("aria-busy", "true");
  submitButton!.disabled = true;
};

const removeLoadingItems = () => {
  footer?.setAttribute("aria-busy", "false");
  submitButton?.setAttribute("aria-busy", "false");
  submitButton!.disabled = false;
};

form?.addEventListener("submit", (e: SubmitEvent) => {
  e.preventDefault();
  setLoadingItems();
  console.log(
    generatePromptByAgeAndThemes(ageInput!.value, themesInput?.value)
  );

  fetch(`https://api.openai.com/v1/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      prompt: generatePromptByAgeAndThemes(ageInput!.value, themesInput?.value),
      max_tokens: 2000,
      model: "text-davinci-003",
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      footer!.innerHTML = translateTextToHtml(data.choices[0].text);
    })
    .finally(() => {
      removeLoadingItems();
    });
});

const translateTextToHtml = (text: string) =>
  text
    .split("\n")
    .map((str) => `<p>${str}</p>`)
    .join("");
