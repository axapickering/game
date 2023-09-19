"use strict";

const $gameContainer = $("#game-container");
const $upgradeContainer = $("#upgrade-container");
const $scoreContainer = $("#score-displays-container");


const $startButton = $("#game-start-button");

$startButton.on("click", () => {
  $("#splash-msg").remove();
  let game = new Game("playername");
});



class Game {
  constructor(playerName) {

    this.playerName = playerName;
    this.lines = 0;

    this.helpers = new Upgrade("helpers", 40, 1.3, []);
    this.helperRate = new Upgrade("helperRate", 200, 2.5, []);
    this.clickAmount = new Upgrade("clickAmount", 25, 2, []);

    this.linesDisplay = new Display($("<div>"), $scoreContainer, `${this.lines} lines of code`);
    this.helperDisplay = new Display($("<div>"), $scoreContainer, `${this.helpers.playerHas} helpers writing ${this.helperRate.playerHas} lines of code per second`);
    this.clickAmountDisplay = new Display($("<div>"), $scoreContainer, `${this.clickAmount.playerHas} lines of code per click`);

  }

  tick = () => {
    this.lines += this.helpers.playerHas * this.helperRate.playerHas;
    this.updateDisplays();
  };

  onClick() {
    this.lines += this.clickAmount.playerHas;
  }

  updateDisplays() {

      this.checkDisplay(this.linesDisplay,1,this.lines);
      this.checkDisplay(this.helperDisplay,1,this.helpers.playerHas);
      this.checkDisplay(this.clickAmountDisplay,2,this.clickAmount.playerHas);

  }

  checkDisplay(display,minToDisplay,resource) {

    if (resource >= minToDisplay) {

      if (!display.isVisible) {
        display.connect();
      }
      display.updateMessage();

    } else if (display.isVisible) {
      display.disconnect();
    }
  }

  updateButtons() {
    this.checkButton(this.helper);
    this.checkButton(this.helperRate);
    this.checkButton(this.clickAmount);
  }


  checkButton(upgrade) {

    if (this.lines >= upgrade.cost) {

      if (!upgrade.button.isVisible) {
        upgrade.button.connect();
      }
      upgrade.button.updateMessage();

    } else if (upgrade.button.isVisible) {
      upgrade.button.disconnect();
    }

  }

}



class Upgrade {

  constructor(name, cost, costMultiplier, upgradeNames, message) {
    this.name = name;
    this.cost = cost;
    this.costMultiplier = costMultiplier;
    this.playerHas = 0;
    this.upgradeNames = upgradeNames;
    this.nameIndex = 0;
    this.button = new Display($("<button>"), $upgradeContainer, message);
  }

  purchase(lines) {

    lines -= this.cost;
      this.playerHas += 1;
      this.cost *= this.costMultiplier;

      return lines;
  }

}

class Display {
  constructor(element, container, message) {
    this.element = element;
    this.container = container;
    this.message = message;
    this.isVisible = false;
  }

  updateMessage = () => {
    this.element.text(this.message);
  };

  connect = () => {
    this.container.append(this.element);
    this.isVisible = true;
  };

  disconnect = () => {
    this.container.detach(this.element);
    this.isVisible = false;
  };
}