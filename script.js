/**
 * Initializes the Trivia Game when the DOM is fully loaded.
 */
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("trivia-form");
    const questionContainer = document.getElementById("question-container");
    const newPlayerButton = document.getElementById("new-player");

    // Initialize the game
    // checkUsername(); Uncomment once completed
    fetchQuestions();
    displayScores();

    /**
     * Fetches trivia questions from the API and displays them.
     */
    function fetchQuestions() {
        showLoading(true); // Show loading state

        fetch("https://opentdb.com/api.php?amount=10&type=multiple")
            .then((response) => response.json())
            .then((data) => {
                displayQuestions(data.results);
                showLoading(false); // Hide loading state
            })
            .catch((error) => {
                console.error("Error fetching questions:", error);
                showLoading(false); // Hide loading state on error
            });
    }

    /**
     * Toggles the display of the loading state and question container.
     *
     * @param {boolean} isLoading - Indicates whether the loading state should be shown.
     */
    function showLoading(isLoading) {
        document.getElementById("loading-container").classList = isLoading
            ? ""
            : "hidden";
        document.getElementById("question-container").classList = isLoading
            ? "hidden"
            : "";
    }

    /**
     * Displays fetched trivia questions.
     * @param {Object[]} questions - Array of trivia questions.
     */
    function displayQuestions(questions) {
        questionContainer.innerHTML = ""; // Clear existing questions
        questions.forEach((question, index) => {
            const questionDiv = document.createElement("div");
            questionDiv.innerHTML = `
                <p>${question.question}</p>
                ${createAnswerOptions(
                    question.correct_answer,
                    question.incorrect_answers,
                    index
                )}
            `;
            questionContainer.appendChild(questionDiv);
        });
    }

    /**
     * Creates HTML for answer options.
     * @param {string} correctAnswer - The correct answer for the question.
     * @param {string[]} incorrectAnswers - Array of incorrect answers.
     * @param {number} questionIndex - The index of the current question.
     * @returns {string} HTML string of answer options.
     */
    function createAnswerOptions(
        correctAnswer,
        incorrectAnswers,
        questionIndex
    ) {
        const allAnswers = [correctAnswer, ...incorrectAnswers].sort(
            () => Math.random() - 0.5
        );
        return allAnswers
            .map(
                (answer) => `
            <label>
                <input type="radio" name="answer${questionIndex}" value="${answer}" ${
                    answer === correctAnswer ? 'data-correct="true"' : ""
                }>
                ${answer}
            </label>
        `
            )
            .join("");
    }

    // Event listeners for form submission and new player button
    form.addEventListener("submit", handleFormSubmit);
    newPlayerButton.addEventListener("click", newPlayer);

    /**
     * Handles the trivia form submission.
     * @param {Event} event - The submit event.
     */
    function handleFormSubmit(event) {
        event.preventDefault();
    
        let username = getCookie("username");
        if (!username) {
            username = document.getElementById("username").value || "Anonymous";
            setCookie("username", username, 7);
        }
    
        const score = calculateScore();
        saveScore(username, score);
        displayScores();
        checkUsername(); // Update UI based on the username cookie
        fetchQuestions(); // Load new questions for another round
    }
    
    
    function checkUsername() {
      //... code for checking if a username cookie is set and adjusting the UI
      const username = getCookie("username");
      const usernameInput = document.getElementById("username");
      const newPlayerButton = document.getElementById("new-player");

      if (username) {
        usernameInput.classList.add("hidden");
        newPlayerButton.classList.remove("hidden");
    } else {
        usernameInput.classList.remove("hidden");
        newPlayerButton.classList.add("hidden");
    }
}
    

    function setCookie(name, value, days) {
        const expires = new Date(Date.now() + days * 86400000).toUTCString();
        document.cookie = `${name}=${value}; expires=${expires}; path=/`;
       
    }
    function getCookie(name) {
        //... code for retrieving a cookie
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
        return null;
    }
    function saveScore(username, score) {
        //... code for saving the score to localStorage
        const scores = JSON.parse(localStorage.getItem("scores") || "[]");
        scores.push({ username, score });
        localStorage.setItem("scores", JSON.stringify(scores));

    }
    function newPlayer() {
        //... code for clearing the username cookie and updating the UI
        setCookie("username", "", -1); // Expire the cookie immediately
        checkUsername();

    }

    function calculateScore() {
        //... code for calculating the score
            const answers = document.querySelectorAll("input[type=radio]:checked");
            let score = 0;
        
            answers.forEach((answer) => {
                if (answer.getAttribute("data-correct") === "true") {
                    score += 1;
                }
            });
        
            return score;
        
    }
    function displayScores() {
        const scores = JSON.parse(localStorage.getItem("scores") || "[]");
        const scoreTableBody = document.getElementById("score-table").querySelector("tbody");
    
        scoreTableBody.innerHTML = "";
        scores.forEach((entry) => {
            const row = document.createElement("tr");
            row.innerHTML = `<td>${entry.username}</td><td>${entry.score}</td>`;
            scoreTableBody.appendChild(row);
        });
    }
});

