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
    
    <h1>Résumé</h1>

    il est possible avec la méthode call ou apply de la classe statique Object de TS/JS d'appeler une méthode d'un object en lui passant un 
    this dynamique !
    le this en question peut etre un simple flux json / object à partir du moment ou les champs sont bien identique en type et nbre
    par contre, si la méthode appelée appel elle même d'autre méthode de la classe courante
    ça ne fonctionne pas car l'objet qui se subtitue à this n'as pas la méthode en question, c'est logique !

    <h1>Experimentation</h1>
    <button type="button" (click)="onClick001()">Clic me ! 001</button>
    <h2>Résultats aprés le clic ...</h2>
    <ul>
        <!-- cf https://stackblitz.com/edit/angular-listbox?file=src%2Fapp%2Fapp.component.html -->
        <li 
          *ngFor="let item of resultats"
          [class.item-selected]="item.selected">{{item.text}}"
        </li>
    </ul>
  `,
})
export class App {
  name = 'Angular HelloWorld 001';
  resultats = [];
  private AddCommentaires(commentaire: string) {
    this.resultats.push({ text: commentaire, selected: true });
  }
  private AddResultat(
    title: string,
    actualValue: string,
    expectedValue: string
  ) {
    var f = (line: string) => this.resultats.push({ text: line });
    f('----------------------------------');
    this.resultats.push(title);
    f('  ' + title);
    f('  actual = ' + actualValue + ', expected = ' + expectedValue);
    if (actualValue == expectedValue) {
      f('  identique');
    } else {
      this.resultats.push({ text: 'DIFFERENT', selected: true });
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
    /* https://www.w3schools.com/js/js_function_apply.asp#:~:text=The%20Difference%20Between%20call(),instead%20of%20an%20argument%20list.
    The difference is: The call() method takes arguments separately. The apply() method takes arguments as an array. The apply() method is very handy if you want to use an array instead of an argument list.
    */
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
      "E1 : On tente maintenant d'utiliser un objet TS de structure identique mais ce n'est pas une Personne, CALL = ",
      emptyPersonne.PoidsValidate.call(bob2AsSimpleObjectFromJSon),
      'bob2|72'
    );
    try {
      this.AddResultat(
        "E1 : est que le 'this' est passé de proche en proche dans les méthodes de EmptyPersonne ? NON, CA NE PEUX PAS FONCTIONNER, CALL = ",
        emptyPersonne.PoidsValidateWithSubMethod.call(
          bob2AsSimpleObjectFromJSon
        ),
        'bob2|72'
      );
    } catch (e: any) {
      this.AddCommentaires('ERREUR ' + e);
    }
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
  public PoidsValidateWithSubMethod() {
    this.PoidsValidate();
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
