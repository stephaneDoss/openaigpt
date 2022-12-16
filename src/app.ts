const form = document.querySelector<HTMLFormElement>("form");
const ageInput = document.querySelector<HTMLInputElement>("#age");
const themesInput = document.querySelector<HTMLInputElement>("#themes");
const submitButton = document.querySelector<HTMLButtonElement>("button");
const footer = document.querySelector<HTMLElement>("footer");

const token = "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";
const generatePromptByAgeAndThemes = (age: number, themes = "") => {
  let prompt = `Propose moi, avec un ton joyeux et amical, 5 idées de cadeau pour une personne âgée de ${age} ans`;

  if (themes.trim()) {
    prompt += ` et qui aime ${themes}`;
  }
  return prompt + " !";
};

const setLoadingItems = () => {
  footer!.textContent = "Chargement de super idées en cours !";
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
  fetch(`https://api.openai.com/v1/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      prompt: generatePromptByAgeAndThemes(
        ageInput!.valueAsNumber,
        themesInput?.value
      ),
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
