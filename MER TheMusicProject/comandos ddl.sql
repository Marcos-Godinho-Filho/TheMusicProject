create schema TheMusicProject;

create table TheMusicProject.Usuario(
	Email varchar(150) primary key,
	Nome varchar(30) not null,
	Senha varchar(30) not null
);

create table TheMusicProject.Playlist(
	IdPlaylist int primary key,
	Nome varchar(30) not null,
	Email varchar(150) not null,
	constraint fkEmail 
	foreign key (Email)
	references TheMusicProject.Usuario (Email)
);

create table TheMusicProject.Musica(
	IdMusica int primary key, 
	Titulo varchar(50) not null,
	Artista varchar(30) not null,
	Album varchar(50) not null,
	Preview varchar(100) not null,
	LinkDeezer varchar(50) not null
);

create table TheMusicProject.PlaylistMusica(
	IdPlaylist int not null,
	IdMusica int not null,
	constraint fkIdPlaylist 
	foreign key (IdPlaylist)
	references TheMusicProject.Playlist(IdPlaylist),
	constraint fkIdMusica
	foreign key (IdMusica)
	references TheMusicProject.Musica(IdMusica),
	primary key (IdPlaylist, IdMusica)
);
