# Sports classes Keyclock auth

Magdalena Makaro

# Opis projektu

Jest to przerobiony projekt z poprzedniego semestru

Jest to aplikacja do zarządzania zajęciami sportowymi. Umożliwia tworzenie, edycję i usuwanie zajęć jako nauczyciel.
Pozwala również studentom zapisać się na zajęcia i zostawić komentarz pod zajęciami, co nie jest dostępne
dla roli nauczyciela. Zarówno dla nauczycieli, jak i studentów możliwe jest przeglądanie listy zajęć
i ich szczegółów oraz tworzenie nowego konta. Aplikacja posiada równiez panel administracyjny, w którym
administrator może usuwać zajęcia użytkowników.

# Instrukcja uruchomienia

Uruchomienie kontenerów z Keyclockiem i bazą danych: Neo4j.

` docker compose up`

Baza danych nie ma mozliwosci zapisania voluminu wiec po uruchomieniu docker compose
przechodzimy na strone http://localhost:7474 i wklejamy komende z pliku neo4j.txt

Odpalenie frontendu:

`cd frontned`

`npm install`

`npm start`

Frontend ma działać na porcie 3000

Odpalenie backendu:

`cd backend`

`npm install`

`node server.js`

Backend ma działać na porcie 5010

# Instrukcja użycia

Mozna sie zalogowac jako:

#### TRENER:

<br/>
login: trainer

haslo: trainer

I tworzyć zajęcia lub edytowac i usuwać poprzednie

#### UCZESTNIK:

<br/>
login: ala

haslo: ala

I zapisać się na zajęcia

#### ADMINISTRATOR:

<br/>
login: admin

haslo: aaa

I usuwać zajęcia użytkowników na niedostępnym dla innych uzytkowników
serwisu panelu administracyjnym
