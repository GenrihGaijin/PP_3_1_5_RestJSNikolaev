CREATE TABLE IF NOT EXISTS users
(
    `id`
    BIGINT
    NOT
    NULL
    AUTO_INCREMENT,
    `name`
    VARCHAR
(
    45
) NOT NULL,
    `last_name` VARCHAR
(
    45
) NOT NULL,
    `age` INT NOT NULL,
    `email` VARCHAR
(
    45
) NOT NULL,
    `username` VARCHAR
(
    45
) NOT NULL,
    `password` VARCHAR
(
    100
) NOT NULL,
    PRIMARY KEY
(
    `id`
),
    UNIQUE INDEX `username_UNIQUE`
(
    `username` ASC
) VISIBLE);

CREATE TABLE IF NOT EXISTS roles
(
    id
    bigint
    auto_increment,
    role
    varchar
(
    25
) not null,
    primary key
(
    id
)
    );

create table users_roles
(
    user_id bigint not null,
    role_id bigint null,
    constraint users_roles_pk
        unique (role_id, user_id),
    constraint users_roles_roles_id_fk
        foreign key (role_id) references roles (id),
    constraint users_roles_users_id_fk
        foreign key (user_id) references users (id)
);

INSERT INTO users (name, last_name, age, email, username, password)
VALUES ('Иван', 'Николаев', 33, 'ivan@mail.ru', 'ivan',
        '$2a$08$k7tTIFdrr2pHo/4RXkR6oegCnfC3dOHI4u4YCHbxbdZBXR40OodOa');

INSERT INTO users (name, last_name, age, email, username, password)
VALUES ('Илья', 'Карпич', 33, 'ilya@mail.ru', 'ilya',
        '$2a$08$qqt5539rvlUnq.spOwxfc.ExOhOKIafCx3kbgWH/ECBHdDG4UZidW');


INSERT INTO roles (id, role)
VALUES (1, 'ROLE_ADMIN');
INSERT INTO roles (id, role)
VALUES (2, 'ROLE_USER');

INSERT INTO users_roles (user_id, role_id)
VALUES (1, 1);

INSERT INTO users_roles (user_id, role_id)
VALUES (2, 2);



