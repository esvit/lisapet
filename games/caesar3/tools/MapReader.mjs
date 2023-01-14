import { PKStream } from './helpers/pkzip.mjs';
import NameGenerator from './objects/NameGenerator.mjs';
import Messages from './objects/Messages.mjs';
import Buildings from './objects/Buildings.mjs';
import Map from './objects/Map.mjs';

export default
class MapReader {
    scenarioCampaignMission = null; // здогадка: номер кампанії

    fileVersion = null; // версія файлу

    cityInfo = [];
    
    map = null;

    constructor(buffer) {
        const stream = new PKStream(buffer);
        stream.seek(4); //

        const type = stream.readInt();
        this.map = new Map();
        if (type === 0x66) {
            stream.seek(0);
            this.readSavedMap(stream);
        } else {
            stream.seek(0);
            this.readScenario(stream);
        }
    }

    readSavedMap(stream) {
        this.scenarioCampaignMission = stream.readInt();
        this.fileVersion = stream.readInt();

        this.map.restoreLayers(stream, true);

        this.map.restoreFigures(stream);

        this.cityInfo = stream.readCompressedShorts(); // city treasury, savings, etc.; rest unknown

        this.cityFactionUnknown = stream.readShort();
        this.playerName = stream.readChar(64); // governor name; rest unknown
        this.cityFaction = stream.readInt();

        this.map.buildings = new Buildings();
        this.map.buildings.restore(stream);
        
        this.cityViewOrientation = stream.readInt();
        this.gameTimeTick = stream.readInt();
        this.gameTimeDay = stream.readInt();
        this.gameTimeMonth = stream.readInt();
        this.gameTimeYear = stream.readInt();
        this.gameTimeTotalDays = stream.readInt();
        this.buildingExtraHighestIdEver = stream.readLong();
        this.randomIV = stream.readLong();
        this.camera = stream.readLong();
        this.buildingCount = {
            theater: { total: stream.readInt(), working: stream.readInt() },
            amphitheater: { total: stream.readInt(), working: stream.readInt() },
            colosseum: { total: stream.readInt(), working: stream.readInt() },
            hippodrome: { total: stream.readInt(), working: stream.readInt() },
            school: { total: stream.readInt(), working: stream.readInt() },
            library: { total: stream.readInt(), working: stream.readInt() },
            academy: { total: stream.readInt(), working: stream.readInt() },
            barber: { total: stream.readInt(), working: stream.readInt() },
            bathhouse: { total: stream.readInt(), working: stream.readInt() },
            clinic: { total: stream.readInt(), working: stream.readInt() },
            hospital: { total: stream.readInt(), working: stream.readInt() },
            smallTempleCeres: { total: stream.readInt() },
            smallTempleNeptune: { total: stream.readInt() },
            smallTempleMercury: { total: stream.readInt() },
            smallTempleMars: { total: stream.readInt() },
            smallTempleVenus: { total: stream.readInt() },
            largeTempleCeres: { total: stream.readInt() },
            largeTempleNeptune: { total: stream.readInt() },
            largeTempleMercury: { total: stream.readInt() },
            largeTempleMars: { total: stream.readInt() },
            largeTempleVenus: { total: stream.readInt() },
            oracle: { total: stream.readInt() },
        };
        this.cityGraphOrder = stream.readLong();
        this.emperorChangeTime = stream.readLong();
        this.empireScroll = { x: stream.readInt(), y: stream.readInt(), selectedObject: stream.readInt() };

        stream.skipCompressed(); // empire map cities, 41 x 66 bytes

        this.buildingCountIndustry = { total: stream.readByte(64), active: stream.readByte(64) };
        this.tradePrices = stream.readByte(128);

        this.nameGenerator = new NameGenerator();
        this.nameGenerator.restore(stream);

        this.cultureCoverage = {
            theater: stream.readInt(),
            amphitheater: stream.readInt(),
            colosseum: stream.readInt(),
            hospital: stream.readInt(),
            hippodrome: stream.readInt(),
            religion_ceres: stream.readInt(),
            religion_neptune: stream.readInt(),
            religion_mercury: stream.readInt(),
            religion_mars: stream.readInt(),
            religion_venus: stream.readInt(),
            oracle: stream.readInt(),
            school: stream.readInt(),
            library: stream.readInt(),
            academy: stream.readInt(),
            hospital2: stream.readInt(), // Yes, hospital is saved twice
        };

        this.map.restoreScenario(stream);

        this.messages = new Messages();
        this.messages.restore(stream);

        this.buildingListBurningTotals = {
            total: stream.readInt(),
            size: stream.readInt(),
        };
        this.figureSequence = stream.readInt();

        this.map.scenario.restoreSettings(stream);
        this.invasionWarnings = stream.readCompressedBytes();
        this.isCustomScenario = stream.readInt();
        this.citySounds = stream.readByte(128);
        this.buildingExtraHighestId = stream.readInt();
    }

    readScenario(stream) {
        this.map.restoreLayers(stream, false);
        this.map.restoreScenario(stream);
    }
}
