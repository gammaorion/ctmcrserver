module.exports = db => {
  console.log("loading test data");

  const tournaments = [
  	{
  		"title" : "First Peacock",
  		"eventdate" : "2021-01-09",
  		"place" : "New-York",
  		"toursAmt" : 3,
  		"tablesAmt" : 3,
  		"comment" : "",
  		"isComplete" : 0
  	},
  	{
  		"title" : "Second Peacock",
  		"eventdate" : "2021-01-16",
  		"place" : "Africa",
  		"toursAmt" : 3,
  		"tablesAmt" : 3,
  		"comment" : "",
  		"isComplete" : 0
  	}
  ];

  const players = [
  	{
  		"surname" : "Иванов",
  		"firstname" : "Андрей",
  		"patronymic" : "",
  		"living" : "СПб",
  		"comment" : "",
  		"isReplacer" : 0
  	},
  	{
  		"surname" : "Нестер",
  		"firstname" : "Татьяна",
  		"patronymic" : "",
  		"living" : "СПб",
  		"comment" : "",
  		"isReplacer" : 0
  	},
  	{
  		"surname" : "Кудрявцева",
  		"firstname" : "Анастасия",
  		"patronymic" : "",
  		"living" : "СПб",
  		"comment" : "",
  		"isReplacer" : 0
  	},
  	{
  		"surname" : "Романецкая",
  		"firstname" : "Ольга",
  		"patronymic" : "",
  		"living" : "СПб",
  		"comment" : "",
  		"isReplacer" : 0
  	},
  	{
  		"surname" : "Нуритдинов",
  		"firstname" : "Андрей",
  		"patronymic" : "",
  		"living" : "СПб",
  		"comment" : "",
  		"isReplacer" : 0
  	},
  	{
  		"surname" : "Абрахин",
  		"firstname" : "Андрей",
  		"patronymic" : "",
  		"living" : "СПб",
  		"comment" : "",
  		"isReplacer" : 0
  	},
  	{
  		"surname" : "Захарова",
  		"firstname" : "Евгения",
  		"patronymic" : "",
  		"living" : "СПб",
  		"comment" : "",
  		"isReplacer" : 0
  	},
  	{
  		"surname" : "Никифоров",
  		"firstname" : "Евгений",
  		"patronymic" : "",
  		"living" : "СПб",
  		"comment" : "",
  		"isReplacer" : 0
  	},
  	{
  		"surname" : "Сазонова",
  		"firstname" : "Ольга",
  		"patronymic" : "",
  		"living" : "СПб",
  		"comment" : "",
  		"isReplacer" : 0
  	},
  	{
  		"surname" : "Черненко",
  		"firstname" : "Денис",
  		"patronymic" : "",
  		"living" : "СПб",
  		"comment" : "",
  		"isReplacer" : 0
  	},
  	{
  		"surname" : "Зинченко",
  		"firstname" : "Вадим",
  		"patronymic" : "",
  		"living" : "СПб",
  		"comment" : "",
  		"isReplacer" : 0
  	},
  	{
  		"surname" : "Бабушкин",
  		"firstname" : "Александр",
  		"patronymic" : "",
  		"living" : "СПб",
  		"comment" : "",
  		"isReplacer" : 0
  	},
  	{
  		"surname" : "Нетребина",
  		"firstname" : "Евгения",
  		"patronymic" : "",
  		"living" : "СПб",
  		"comment" : "",
  		"isReplacer" : 0
  	},
  	{
  		"surname" : "Петухов",
  		"firstname" : "Михаил",
  		"patronymic" : "",
  		"living" : "СПб",
  		"comment" : "",
  		"isReplacer" : 0
  	},
  	{
  		"surname" : "Быков",
  		"firstname" : "Дмитрий",
  		"patronymic" : "",
  		"living" : "СПб",
  		"comment" : "",
  		"isReplacer" : 0
  	},
  	{
  		"surname" : "Полянская",
  		"firstname" : "Ирина",
  		"patronymic" : "Владимировна",
  		"living" : "СПб",
  		"comment" : "",
  		"isReplacer" : 0
  	},
  	{
  		"surname" : "Киселева",
  		"firstname" : "Евгения",
  		"patronymic" : "",
  		"living" : "СПб",
  		"comment" : "",
  		"isReplacer" : 0
  	},
  	{
  		"surname" : "Свидрицкий",
  		"firstname" : "Олег",
  		"patronymic" : "",
  		"living" : "СПб",
  		"comment" : "",
  		"isReplacer" : 0
  	},
  	{
  		"surname" : "Малахов",
  		"firstname" : "Сергей",
  		"patronymic" : "",
  		"living" : "СПб",
  		"comment" : "",
  		"isReplacer" : 0
  	},
  	{
  		"surname" : "Нечаев",
  		"firstname" : "Роман",
  		"patronymic" : "",
  		"living" : "СПб",
  		"comment" : "",
  		"isReplacer" : 0
  	}
  ];

  db.tournaments.bulkCreate(tournaments);
  db.players.bulkCreate(players);
};
