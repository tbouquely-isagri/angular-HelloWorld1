import 'zone.js/dist/zone';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';

@Component({
  selector: 'my-app',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>{{name}}!</h1>
    <h2>Prototype de repository de regle de gestion de validation d'entité sur base d'une entité de référence</h2>
    
    <h1>Experimentation</h1>
    <button type="button" (click)="onClick001()">Clic me ! 001</button>
    <h2>Résultats aprés le clic ...</h2>
    <ul>
        <!-- cf https://stackblitz.com/edit/angular-listbox?file=src%2Fapp%2Fapp.component.html -->
        <li *ngFor="let item of resultats">{{item.text}}</li>
    </ul>
  `,
})
export class App {
  name = 'Angular HelloWorld 001';
  resultats = [];
  private AddResultat(
    title: string,
    actualValue: string,
    expectedValue: string
  ) {
    var f = (line: string) => this.resultats.push({ text: line });
    f('----------------------------------');
    this.resultats.push(title);
    f('  ' + title);
    f('  actual = ' + actualValue);
    f('  expected = ' + expectedValue);
    if (actualValue == expectedValue) {
      f('  identique');
    } else {
      f('   DIFFERENT DIFFERENT DIFFERENT DIFFERENT');
    }
  }

  public onClick001() {
    // Lancement simple directement sur une instance de Person
    var bob1 = new Personne('bob1', 71);
    // ces deux appels font la même chose
    this.AddResultat(
      'A : validation directe sur une Personne = ',
      bob1.PoidsValidate(),
      'bob1|71'
    );

    this.AddResultat(
      'B : validation via une méthode statique porté sur la classe Personne = ',
      Personne.PoidsValidateOn(bob1),
      'bob1|71'
    );

    var bob2AsSimpleObjectFromJSon = {
      NomCommun: 'bob2',
      Poids: 72.0,
    };

    // Cet appel directe ne fonctionne pas car bob2 est un json/structure qui n'est pas une personne
    // bien que disposant des mêmes attributs
    //alert(Personne.PoidsValidateOn(bob2));

    // ceci n'est pas trop de sens, je pense, car le "this" de la méthode PoidsValidate n'est pas affecté par le bind
    // car le this utilisé dans la méthode n'est pas la fonction mais la classe mére
    bob1.PoidsValidate.bind(bob2AsSimpleObjectFromJSon);
    this.AddResultat(
      'C : tentative de la methode bind sur la méthode de validation, KO = ',
      bob1.PoidsValidate(),
      'bob2|72'
    );

    // ça, par contre, ça fonctionne
    // ce qui m'ennuie, c'est que ce doitetre une copie par valeur et non un référencement
    // bob1 change d'état interne lors de l'affectation
    // c'est pas ce que je recherche
    // je souhaite me servir d'un bob1 "vide" juste porteur des méthodes de validation
    Object.assign(bob1, bob2AsSimpleObjectFromJSon);
    this.AddResultat(
      "D : utilisation dela méthode Object.assign, ça marche mais l'état est copié, c'est pas ce que je veut, pas performant",
      bob1.PoidsValidate(),
      'bob2|72'
    );

    // par contre, Object contient plein de méthode générique bas niveau :)
    var emptyPersonne = new Personne('', 0);
    var bob3 = new Personne('bob3', 333);
    this.AddResultat(
      'E1 : on créer une Personne vide = ',
      emptyPersonne.PoidsValidate(),
      '|0'
    );
    this.AddResultat(
      'E1 : On utilise sa méthode de validation via APPLY, OK = ',
      emptyPersonne.PoidsValidate.apply(bob3),
      'bob3|333'
    );
    this.AddResultat(
      'E1 : On utilise sa méthode de validation via CALL, OK = ',
      emptyPersonne.PoidsValidate.call(bob3),
      'bob3|333'
    );
    this.AddResultat(
      "E1 : On vérifier que l'état de la personne vide est toujours vide = ",
      emptyPersonne.PoidsValidate(),
      '|0'
    );
    this.AddResultat(
      "E1 : On tente maintenant d'utiliser un objet TS de structure identique mais ce n'est pas une Personne, APPLY = ",
      emptyPersonne.PoidsValidate.apply(bob2AsSimpleObjectFromJSon),
      'bob2|72'
    );
    this.AddResultat(
      "E1 : On tente maintenant d'utiliser un objet TS de structure identique mais ce n'est pas une Personne, CALL = ",
      emptyPersonne.PoidsValidate.call(bob2AsSimpleObjectFromJSon),
      'bob2|72'
    );
    this.AddResultat(
      'E1 : notre personne vide est toujours vide ! = ',
      emptyPersonne.PoidsValidate(),
      '|0'
    );
  }
}

class Personne {
  public NomCommun: string;
  public Poids: number;

  constructor(nom: string, poids: number) {
    this.NomCommun = nom;
    this.Poids = poids;
  }
  public PoidsValidate() {
    // this ici pointe bien sur l'instance de la class Personne
    return Personne.PoidsValidateOn(this);
  }

  public static PoidsValidateOn(item: Personne) {
    // this dans le cas présent retour la fonction elle même et non la classe Person par exemple
    // logique, on est dans une méthode statique
    // je retourne volontairement quelque chose de unittestable ...
    return item.NomCommun + '|' + item.Poids;
    /*
    if (item.Poids < 0) {
      return (
        'le poids de ' + item.NomCommun + ' ne peut etre inférieure à zéro !'
      );
    } else {
      return 'le poids de ' + item.NomCommun + ' est de ' + item.Poids;
    }
    */
  }
}

bootstrapApplication(App);
