import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'petRacePerkDescription'
})
export class PetRacePerkDescriptionPipe implements PipeTransform {

  transform(value: string, level: number): unknown {
    let finalValue = "<div class='perk-description'>";
    let descriptionParts = value.split("$");

    for (let i = 0; i < descriptionParts.length; i++) {
      if (i % 2 === 0) {
        finalValue += descriptionParts[i];
      }
      else {
        let statsText = `<span class="perk-description-stats">`;
        let stats = descriptionParts[i].split("/");
        for (let j = 0; j < stats.length; j++) {
          if (j + 1 === level) {
            stats[j] = `<span class="perk-description-highlighted-stat">${stats[j]}</span>`;
            break;
          }
        }
        statsText += `${stats.join("/")}</span>`
        finalValue += statsText;
      }
    }
    return finalValue;
  }

}
