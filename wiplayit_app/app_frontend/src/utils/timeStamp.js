


export default class GetTimeStamp {
    constructor(props) {
        this.timeStamp = props && props.timeStamp;
    }
    /*
    timeStamp(){
        return props && props.timeStamp
    }*/

    currentTimeStamp(){
        return new Date();
    }

    milliSeconds(){
        let currentTimeStamp = this.currentTimeStamp();
        return currentTimeStamp.getTime() - this.timeStamp
    }

    seconds(){
        return this.milliSeconds() / 1000;
    }
    
    menutes(){
        return this.seconds() / 60;
    }

    hours(){
        return this.menutes()  / 60;
    }

    timeStampByHours(){
        return this.hours() / 24
    }
  
}
