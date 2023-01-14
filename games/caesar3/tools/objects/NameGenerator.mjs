export default 
class NameGenerator {
  restore(stream) {
    this.citizenMale = stream.readInt();
    this.patrician = stream.readInt();
    this.citizenFemale = stream.readInt();
    this.taxCollector = stream.readInt();
    this.engineer = stream.readInt();
    this.prefect = stream.readInt();
    this.javelinThrower = stream.readInt();
    this.cavalry = stream.readInt();
    this.legionary = stream.readInt();
    this.actor = stream.readInt();
    this.gladiator = stream.readInt();
    this.lionTamer = stream.readInt();
    this.charioteer = stream.readInt();
    this.barbarian = stream.readInt();
    this.enemyGreek = stream.readInt();
    this.enemyEgyptian = stream.readInt();
    this.enemyArabian = stream.readInt();
    this.trader = stream.readInt();
    this.ship = stream.readInt();
    this.warship = stream.readInt();
    this.enemyWarship = stream.readInt();
  }
}
