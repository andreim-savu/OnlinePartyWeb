import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IPetRacePerk } from './interfaces/ipet-race-perk';
import { IPetRacePlayer } from './interfaces/ipet-race-player';

@Injectable({
  providedIn: 'root'
})
export class PetRaceGameService {

  perkList: IPetRacePerk[] = [];

  potentialCommonPerks: IPetRacePerk[] = [];
  potentialRarePerks: IPetRacePerk[] = [];
  potentialEpicPerks: IPetRacePerk[] = [];
  potentialLegendaryPerks: IPetRacePerk[] = [];

  constructor(private firestore: AngularFirestore) { }

  async getPerks() {
    let perksCollection = this.firestore.collection('PetRacePerks').get();
    await perksCollection.forEach(collection => {
      for (let doc of collection.docs) {
        let a = doc.data();
        this.perkList.push(a as IPetRacePerk);
      }
    });
  }

  setPerks(playerData: IPetRacePlayer) {

    let tempPerks = JSON.parse(JSON.stringify(this.perkList));

    for (let perk of tempPerks) {

      for (let j = 0; j < playerData.inventoryPerks.length; j++) {
        if (perk.id === playerData.inventoryPerks[j].id) {
          perk.level = playerData.inventoryPerks[j].level;
        }
      }

      if (playerData.pet) {
        for (let j = 0; j < playerData.pet!.perks.length; j++) {
          if (perk.id === playerData.pet!.perks[j].id) {
            perk.level = playerData.pet!.perks[j].level;
          }
        }
      }

      if (perk.level === 5) {
        continue;
      }

      if (perk.level === undefined || perk.level === null) { perk.level = 0; }
      if (perk.rarity === "Common") { this.potentialCommonPerks.push(perk); }
      if (perk.rarity === "Rare") { this.potentialRarePerks.push(perk); }
      if (perk.rarity === "Epic") { this.potentialEpicPerks.push(perk); }
      if (perk.rarity === "Legendary") { this.potentialLegendaryPerks.push(perk); }
    }
  }

  getPerksFromRefresh(perks: IPetRacePerk[]) {
    let perkList: IPetRacePerk[] = [];

    for (let perk of perks) {
      switch (perk.rarity) {
        case "Common":
          for (let i = 0; i < this.potentialCommonPerks.length; i++) {
            if (this.potentialCommonPerks[i].id === perk.id) {
              perkList.push(this.potentialCommonPerks[i]);
            }
          }
          break;
        case "Rare":
          for (let i = 0; i < this.potentialRarePerks.length; i++) {
            if (this.potentialRarePerks[i].id === perk.id) {
              perkList.push(this.potentialRarePerks[i]);
            }
          }
          break;
        case "Epic":
          for (let i = 0; i < this.potentialEpicPerks.length; i++) {
            if (this.potentialEpicPerks[i].id === perk.id) {
              perkList.push(this.potentialEpicPerks[i]);
            }
          }
          break;
        case "Legendary":
          for (let i = 0; i < this.potentialLegendaryPerks.length; i++) {
            if (this.potentialLegendaryPerks[i].id === perk.id) {
              perkList.push(this.potentialLegendaryPerks[i]);
            }
          }
          break;
      }
    }

    return perkList;
  }

  updatePerk(perk: IPetRacePerk) {
    perk.level!++;
    if (perk.level === 5) {
      switch (perk.rarity) {
        case "Common":
          this.potentialCommonPerks.splice(this.potentialCommonPerks.indexOf(perk), 1);
          break;
        case "Rare":
          this.potentialRarePerks.splice(this.potentialRarePerks.indexOf(perk), 1);
          break;
        case "Epic":
          this.potentialEpicPerks.splice(this.potentialEpicPerks.indexOf(perk), 1);
          break;
        case "Legendary":
          this.potentialLegendaryPerks.splice(this.potentialLegendaryPerks.indexOf(perk), 1);
          break;
      }
    }
  }

  getPerkById(id: string, level: number): IPetRacePerk {
    for (let perk of this.potentialCommonPerks) {
      if (perk.id === id) {
        perk.level = level;
        return perk;
      }
    }
    for (let perk of this.potentialRarePerks) {
      if (perk.id === id) {
        perk.level = level;
        return perk;
      }
    }
    for (let perk of this.potentialEpicPerks) {
      if (perk.id === id) {
        perk.level = level;
        return perk;
      }
    }
    for (let perk of this.potentialLegendaryPerks) {
      if (perk.id === id) {
        perk.level = level;
        return perk;
      }
    }
    return this.perkList[0];
  }

  removePerkFromList(perk: IPetRacePerk) {
    if (perk.rarity === "Common") {
      for (let i = 0; i < this.potentialCommonPerks.length; i++) {
        if (perk.id === this.potentialCommonPerks[i].id) {
          break;
        }
      }
    }
    else if (perk.rarity === "Rare") {
      for (let i = 0; i < this.potentialRarePerks.length; i++) {
        if (perk.id === this.potentialRarePerks[i].id) {
          this.potentialRarePerks.splice(i, 1);
          break;
        }
      }
    }
    else if (perk.rarity === "Epic") {
      for (let i = 0; i < this.potentialEpicPerks.length; i++) {
        if (perk.id === this.potentialEpicPerks[i].id) {
          this.potentialEpicPerks.splice(i, 1);
          break;
        }
      }
    }
    else {
      for (let i = 0; i < this.potentialLegendaryPerks.length; i++) {
        if (perk.id === this.potentialLegendaryPerks[i].id) {
          this.potentialLegendaryPerks.splice(i, 1);
          break;
        }
      }
    }
  }

  setPerkChoices(currentPerks: IPetRacePerk[], turnNo: number) {
    if (currentPerks.length === 3) { return; }
    if (turnNo < 4) {
      currentPerks.push(this.getPerkTier1(currentPerks));
    }
    else if (turnNo === 4) {
      currentPerks.push(this.getRarePerk(currentPerks));
    }
    else if (turnNo < 7) {
      currentPerks.push(this.getPerkTier2(currentPerks));
    }
    else if (turnNo === 7) {
      currentPerks.push(this.getEpicPerk(currentPerks));
    }
    else if (turnNo < 10) {
      currentPerks.push(this.getPerkTier3(currentPerks));
    }
    else if (turnNo === 10) {
      currentPerks.push(this.getLegendaryPerk(currentPerks));
    }
    else {
      currentPerks.push(this.getPerkTier4(currentPerks));
    }
    if (currentPerks.length < 3) {
      this.setPerkChoices(currentPerks, turnNo);
    }
  }

  setPerksReroll(currentPerks: IPetRacePerk[], turnNo: number) {
    if (currentPerks.length === 3) { return; }
    if (turnNo < 4) {
      currentPerks.push(this.getPerkTier1(currentPerks));
    }
    else if (turnNo < 7) {
      currentPerks.push(this.getPerkTier2(currentPerks));
    }
    else if (turnNo < 10) {
      currentPerks.push(this.getPerkTier3(currentPerks));
    }
    else {
      currentPerks.push(this.getPerkTier4(currentPerks));
    }
    if (currentPerks.length < 3) {
      this.setPerksReroll(currentPerks, turnNo);
    }
  }

  getPerkTier1(currentPerks: IPetRacePerk[]) {
    let commonPerks = [...this.potentialCommonPerks];

    for (let currentPerk of currentPerks) {
      for (let perk of commonPerks) {
        if (currentPerk.id === perk.id) {
          commonPerks.splice(commonPerks.indexOf(perk), 1);
        }
      }
    }

    let randomIndex = Math.floor(Math.random() * commonPerks.length);
    return commonPerks[randomIndex];
  }

  getPerkTier2(currentPerks: IPetRacePerk[]) {
    let commonPerks = [...this.potentialCommonPerks];
    let rarePerks = [...this.potentialRarePerks];

    for (let currentPerk of currentPerks) {
      for (let perk of commonPerks) {
        if (currentPerk.id === perk.id) {
          commonPerks.splice(commonPerks.indexOf(perk), 1);
        }
      }
      for (let perk of rarePerks) {
        if (currentPerk.id === perk.id) {
          rarePerks.splice(rarePerks.indexOf(perk), 1);
        }
      }
    }

    let tierChance = Math.floor(Math.random() * 101);
    if (tierChance <= 85 && commonPerks.length > 0) {
      let randomIndex = Math.floor(Math.random() * commonPerks.length);
      return commonPerks[randomIndex];
    }
    else {
      let randomIndex = Math.floor(Math.random() * rarePerks.length);
      return rarePerks[randomIndex];
    }
  }

  getPerkTier3(currentPerks: IPetRacePerk[]) {
    let commonPerks = [...this.potentialCommonPerks];
    let rarePerks = [...this.potentialRarePerks];
    let epicPerks = [...this.potentialEpicPerks];

    for (let currentPerk of currentPerks) {
      for (let perk of commonPerks) {
        if (currentPerk.id === perk.id) {
          commonPerks.splice(commonPerks.indexOf(perk), 1);
        }
      }
      for (let perk of rarePerks) {
        if (currentPerk.id === perk.id) {
          rarePerks.splice(rarePerks.indexOf(perk), 1);
        }
      }
      for (let perk of epicPerks) {
        if (currentPerk.id === perk.id) {
          rarePerks.splice(rarePerks.indexOf(perk), 1);
        }
      }
    }

    let tierChance = Math.floor(Math.random() * 101);

    if (tierChance <= 70 && commonPerks.length > 0) {
      let randomIndex = Math.floor(Math.random() * commonPerks.length);
      return commonPerks[randomIndex];
    }
    else if (tierChance <= 90 && rarePerks.length > 0) {
      let randomIndex = Math.floor(Math.random() * rarePerks.length);
      return rarePerks[randomIndex];
    }
    else {
      let randomIndex = Math.floor(Math.random() * epicPerks.length);
      return epicPerks[randomIndex];
    }
  }

  getPerkTier4(currentPerks: IPetRacePerk[]) {
    let commonPerks = [...this.potentialCommonPerks];
    let rarePerks = [...this.potentialRarePerks];
    let epicPerks = [...this.potentialEpicPerks];
    let legendaryPerks = [...this.potentialLegendaryPerks];

    for (let currentPerk of currentPerks) {
      for (let perk of commonPerks) {
        if (currentPerk.id === perk.id) {
          commonPerks.splice(commonPerks.indexOf(perk), 1);
        }
      }
      for (let perk of rarePerks) {
        if (currentPerk.id === perk.id) {
          rarePerks.splice(rarePerks.indexOf(perk), 1);
        }
      }
      for (let perk of epicPerks) {
        if (currentPerk.id === perk.id) {
          rarePerks.splice(rarePerks.indexOf(perk), 1);
        }
      }
      for (let perk of legendaryPerks) {
        if (currentPerk.id === perk.id) {
          rarePerks.splice(rarePerks.indexOf(perk), 1);
        }
      }
    }

    let tierChance = Math.floor(Math.random() * 101);

    if (tierChance <= 50 && commonPerks.length > 0) {
      let randomIndex = Math.floor(Math.random() * commonPerks.length);
      return commonPerks[randomIndex];
    }
    else if (tierChance <= 75 && rarePerks.length > 0) {
      let randomIndex = Math.floor(Math.random() * rarePerks.length);
      return rarePerks[randomIndex];
    }
    else if (tierChance <= 90 && epicPerks.length > 0) {
      let randomIndex = Math.floor(Math.random() * epicPerks.length);
      return epicPerks[randomIndex];
    }
    else {
      let randomIndex = Math.floor(Math.random() * legendaryPerks.length);
      return legendaryPerks[randomIndex];
    }
  }

  getRarePerk(currentPerks: IPetRacePerk[]) {
    let rarePerks = [...this.potentialRarePerks];

    for (let currentPerk of currentPerks) {
      for (let perk of rarePerks) {
        if (currentPerk.id === perk.id) {
          rarePerks.splice(rarePerks.indexOf(perk), 1);
        }
      }
    }

    let randomIndex = Math.floor(Math.random() * rarePerks.length);
    return rarePerks[randomIndex];
  }

  getEpicPerk(currentPerks: IPetRacePerk[]) {
    let epicPerks = [...this.potentialEpicPerks];

    for (let currentPerk of currentPerks) {
      for (let perk of epicPerks) {
        if (currentPerk.id === perk.id) {
          epicPerks.splice(epicPerks.indexOf(perk), 1);
        }
      }
    }

    let randomIndex = Math.floor(Math.random() * epicPerks.length);
    return epicPerks[randomIndex];
  }

  getLegendaryPerk(currentPerks: IPetRacePerk[]) {
    let legendaryPerks = [...this.potentialLegendaryPerks];

    for (let currentPerk of currentPerks) {
      for (let perk of legendaryPerks) {
        if (currentPerk.id === perk.id) {
          legendaryPerks.splice(legendaryPerks.indexOf(perk), 1);
        }
      }
    }

    let randomIndex = Math.floor(Math.random() * legendaryPerks.length);
    return legendaryPerks[randomIndex];
  }
}
