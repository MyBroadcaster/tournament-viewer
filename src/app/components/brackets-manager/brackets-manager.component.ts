import { Component, OnInit } from '@angular/core';

// Vendor
import { InMemoryDatabase } from 'src/app/storage/memory';
import { BracketsManager } from 'brackets-manager/dist/manager';
import { dataset8 } from 'src/app/data/datasets';

const TOURNAMENT_ID = 0;

function getNearestPowerOfTwo(input: number): number {
  return Math.pow(2, Math.ceil(Math.log2(input)));
}

async function process(dataset: Dataset) {
  const db = new InMemoryDatabase();
  const manager = new BracketsManager(db);

  db.setData({
    participant: dataset.roster.map((player) => ({
      ...player,
      tournament_id: TOURNAMENT_ID,
    })),
    stage: [],
    group: [],
    round: [],
    match: [],
    match_game: [],
  });

  await manager.create({
    name: dataset.title,
    tournamentId: TOURNAMENT_ID,
    type: dataset.type,
    seeding: dataset.roster.map((player) => player.name),
    settings: {
      seedOrdering: ["inner_outer"],
      size: getNearestPowerOfTwo(dataset.roster.length),
      matchesChildCount: 3
    },
  });

  // Group Stage
  await manager.update.match({
    id: 0,
    opponent1: {id: 7, result: "win", score: 2},
    opponent2: {id: 355, result: "loss", score: 1}
  });

  await manager.update.match({
    id: 1,
    opponent1: {id: 523, result: "loss", score: 1},
    opponent2: {id: 123, result: "win", score: 2}
  });

  await manager.update.match({
    id: 2,
    opponent1: {id: 55, result: "win", score: 2},
    opponent2: {id: 354, result: "loss", score: 1}
  });

  await manager.update.match({
    id: 3,
    opponent1: {id: 353, result: "win", score: 2},
    opponent2: {id: 53, result: "loss", score: 1}
  });

  // Semi Final
  await manager.update.match({
    id: 4,
    opponent1: {id: 7, result: "win", score: 2},
    opponent2: {id: 123, result: "loss", score: 1}
  });

  await manager.update.match({
    id: 5,
    opponent1: {id: 55, result: "loss", score: 1},
    opponent2: {id: 353, result: "win", score: 2}
  });

  // Final
  await manager.update.match({
    id: 6,
    opponent1: {id: 7, result: "win", score: 2},
    opponent2: {id: 353, result: "loss", score: 1}
  });

  const data = await manager.get.stageData(0);

  return {
    stages: data.stage,
    matches: data.match,
    matchGames: data.match_game,
    participants: data.participant,
  };
}

@Component({
  selector: 'app-brackets-manager',
  templateUrl: './brackets-manager.component.html',
  styleUrls: ['./brackets-manager.component.scss']
})
export class BracketsManagerComponent implements OnInit {
  ngOnInit() {
    window.bracketsViewer.addLocale("en", {
      common: {
        "group-name-winner-bracket": "{{stage.name}}",
        "group-name-loser-bracket": "{{stage.name}} - Repechage",
      },
      "origin-hint": {
        "winner-bracket": "WB {{round}}.{{position}}",
        "winner-bracket-semi-final": "WB Semi {{position}}",
        "winner-bracket-final": "WB Final",
        "consolation-final": "Semi {{position}}",
      }
    });

    process(dataset8).then((data) => window.bracketsViewer.render(data));
  }
}
