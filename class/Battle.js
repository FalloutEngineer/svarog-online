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
    }

    start(){
        this._stage = 1;

        if(this._firstOpponent.enterBattle){
            this._firstOpponent.enterBattle();
        }
        if(this._secondOpponent.enterBattle){
            this._secondOpponent.enterBattle();
        }
    }

    end(){
        this._stage = 2;
        this._winner = this._currentActor;

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

    async autoBattle(){
        this._article._user = this._firstOpponent;
        this._article._secondOpponent = this._secondOpponent;
        while(this._stage != 2){
            await this.timeout(1000);
            console.log(`[Крок ${this._currentStep}]`);
            this._article.step = this._currentStep;
            this._article.updateMessage();
            if(this.isNextActorDead()){
                this.end()
                return;
            }
            const attackAnswer = this._currentActor.attack(this._nextActor);
            if(attackAnswer.answer.isMiss){
                console.log(this._currentActor.soundEmitter.miss);
            }else{
                console.log(this._currentActor.soundEmitter.attack(this._nextActor.name));
                console.log(this._nextActor.soundEmitter.ouch());
            }
            this._article._user = this._firstOpponent;
            this.nextStep();
        }
        return this.winner;
    }

    registerBattleArticle(article){
        this._article = article;
    }
}