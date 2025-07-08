"use strict";
export function Homework(id,question,answer,state = "open",score= null,fk_iduser){
    this.id=id;
    this.question=question;
    this.answer=answer;
    this.state=state;
    this.score=score;
    this.fk_iduser=fk_iduser;
}


