label => 'Реплики',

columns => {

	id_task            => "(tasks)", # Дело
	id_user            => "(users)", # Пользователь
	is_author          => 'int=0',   # 1, если автор; 0, если адресат
},

keys => {
	id_user => 'id_user,id_task',
	id_task => 'id_task,is_author',
},