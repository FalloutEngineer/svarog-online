const Hero = require('./Hero');
const Mob = require('./Mob');

module.exports = class Battle{
    constructor(firstOpponent, secondOpponent, article){
        this._article = article;

        this._firstOpponent = firstOpponent;
        this._secondOpponent = secondOpponent;
        this._currentStep = 0;
        this._lastAction = "";
        this._currentActor = this._firstOpponent;
        this._nextActor = this._secondOpponent;
        this._winner = null;
        this._loser = null;
        this._stage = 0;
        this._type = 'pve';

    }

    get opponents(){
        return [this.firstOpponent, this.secondOpponent]
    }

    get currentStep(){
        return this._currentStep;
    }

    get lastAction(){
        return this._lastAction;
    }

    get currentActor(){
        return this._currentActor;
    }

    get nextActor(){
        return this._nextActor;
    }

    get winner(){
        return this._winner;
    }

    get loser(){
        return this._nextActor;
    }

    get stage(){
        return this._stage;
    }

    isNextActorDead(){
        if(this._nextActor.hp == 0){
            this._winner = this._currentActor;
            this._loser = this._nextActor;
            return true;
        }
        return false;
    }

    isCurrentActorDead(){
        if(this._currentActor.hp == 0){
            this._winner = this._nextActor;
            this._loser = this._currentActor;
            return true;
        }
        return false;
    }

    nextStep(){
        this._currentStep = this._currentStep + 1;
        let temp = this._currentActor;
        this._currentActor = this._nextActor;
        this._nextActor = temp;
        this._article.currentActor = this._currentActor;
        this._article.nextActor = this._nextActor;

        if(this._currentActor.actionsBeforeStep){
            this._currentActor.actionsBeforeStep();
        }
    }

    start(){
        this._stage = 1;

        this._article.currentActor = this._firstOpponent;
        this._article._nextActor = this._secondOpponent;

        this._article._firstOpponent = this._firstOpponent;
        this._article._secondOpponent = this._secondOpponent;

        if(this._firstOpponent.enterBattle){
            this._firstOpponent.enterBattle();
        }
        if(this._secondOpponent.enterBattle){
            this._secondOpponent.enterBattle();
        }

        this._article.init();
    }

    end(actor){

        this._article._winner = actor;
        
        // this._article.updateMessage();

        this._stage = 2;
        this._winner = actor;

        this._article.updateEndMessage();

        if(this._firstOpponent.exitBattle){
            this._firstOpponent.exitBattle();
        }
        if(this._secondOpponent.exitBattle){
            this._secondOpponent.exitBattle();
        }
    }

    timeout(ms){
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async battle(){ //TODO: Step-by-step battle cycle
        while(this._stage != 2){
            if(this.isNextActorDead()){
                this._stage = 2;
                this.end(this._currentActor);
                return;
            }
            if(this.isCurrentActorDead()){
                this._stage = 2;
                this.end(this._nextActor);
                return;
            }

            await this.timeout(1000);
            this._article.step = this._currentStep;
            this._article.updateMessage();
            if(this.currentActor instanceof Hero){
                await this.waitForAction();
                this.nextStep();
            }else if (this.currentActor instanceof Mob){

                const attackAnswer = this._currentActor.attack(this._nextActor);
                if(attackAnswer.answer.isMiss){
                    this._article.appendToHistory(this._currentActor.soundEmitter.miss());
                }else if(attackAnswer.answer.isOutOfStamina){
                    console.log(attackAnswer.answer.isOutOfStamina);
                    this._article.appendToHistory(this._currentActor.soundEmitter.outOfStamina());
                }else{
                    this._article.appendToHistory(this._currentActor.soundEmitter.attack(this._nextActor.name));
                    this._article.appendToHistory(this._nextActor.soundEmitter.ouch());
                }
                this._article._user = this._firstOpponent;
                this.nextStep(); //TODO: calculations before between step, calculate win between steps
            }else{
                return;
            }
        }
    }

    surrender(playerId){
        if(this._firstOpponent.id == playerId){
            end(this._secondOpponent);
        }
        if(this._secondOpponent.id == playerId){
            end(this._firstOpponent);
        }
    }

    waitForAction() {
        return new Promise(resolve => {
          this.actionResolver = resolve;
        });
      }

    performAction(query, answer) {
        console.log('action performed');
        if(answer == "aut_att"){
            const attackAnswer = this._currentActor.attack(this._nextActor);
            if(attackAnswer.answer.isMiss){
                this._article.appendToHistory(this._currentActor.soundEmitter.miss());
            }else if(attackAnswer.answer.isOutOfStamina){
                this._article.appendToHistory(this._currentActor.soundEmitter.outOfStamina());
            }else{
                this._article.appendToHistory(this._currentActor.soundEmitter.attack(this._nextActor.name));
                this._article.appendToHistory(this._nextActor.soundEmitter.ouch());
            }
        }
        if(answer == "str_att"){
            const attackAnswer = this._currentActor.strongAttack(this._nextActor);
            if(attackAnswer.answer.isMiss){
                this._article.appendToHistory(this._currentActor.soundEmitter.miss());
            }else if(attackAnswer.answer.isOutOfStamina){
                this._article.appendToHistory(this._currentActor.soundEmitter.outOfStamina());
            }else{
                this._article.appendToHistory(this._currentActor.soundEmitter.attack(this._nextActor.name));
                this._article.appendToHistory(this._nextActor.soundEmitter.ouch());
            }
        }
        
        this.actionResolver();
    }

    performMenuAction(query, answer){
        console.log('action performed');
        if(answer == 'weapon'){
            this._article.selectMarkupFunction(this._article.formLimbBattleButtons);
        }
        if(answer == 'left_hand'){
            this._article.selectMarkupFunction(this._article.formLimbFriendlyButtons);
        }
        if(answer == 'status'){
            this._article.selectMessageFunction(this._article.formEffectsMessage);
            this._article.selectMarkupFunction(this._article.formToMenuButton);
        }
        if(answer == 'run'){
            this._article.selectMarkupFunction(this._article.formConfirmRunAwayButtons);
        }
        if(answer == 'run_con'){
            console.log('run confirmed');

            //TODO:
            if(this._article._currentBattleMessageFuncton != this._article.formBattleText){
                this._article.selectMessageFunction(this._article.formBattleText);
            }
            this._article.selectMarkupFunction(this._article.formMainBattleButtons);

        }
        if(answer == 'surrender'){
            this._article.selectMarkupFunction(this._article.formConfirmSurrender);
        }
        if(answer == 'sur_con'){
            console.log('surrender confirmed');

            //TODO:
            if(this._article._currentBattleMessageFuncton != this._article.formBattleText){
                this._article.selectMessageFunction(this._article.formBattleText);
            }
            this._article.selectMarkupFunction(this._article.formMainBattleButtons);

        }
        if(answer == 'end_step'){
            this.nextStep(); //TODO: calculations before between step, calculate win between steps
        }
        if(answer == 'toMain'){
            if(this._article._currentBattleMessageFuncton != this._article.formBattleText){
                this._article.selectMessageFunction(this._article.formBattleText);
            }
            this._article.selectMarkupFunction(this._article.formMainBattleButtons);
        }
        this._article.updateMessage();
    }


    //TODO: rework for expeditions
    async autoBattle(){
        while(this._stage != 2){
            await this.timeout(1000);
            this._article.step = this._currentStep;
            if(this.isNextActorDead()){
                this._stage = 2;
                this.end(this._currentActor)
                return;
            }
            if(this.isCurrentActorDead()){
                this._stage = 2;
                this.end(this._nextActor)
                return;
            }
            const attackAnswer = this._currentActor.attack(this._nextActor);
            if(attackAnswer.answer.isMiss){
                this._article.appendToHistory(this._currentActor.soundEmitter.miss);
            }else{
                this._article.appendToHistory(this._currentActor.soundEmitter.attack(this._nextActor.name));
                this._article.appendToHistory(this._nextActor.soundEmitter.ouch());
            }
            this._article._user = this._firstOpponent;
            this.nextStep();
            this._article.updateMessage();
        }

        return this.winner;
    }

    registerBattleArticle(article){
        this._article = article;
    }
}