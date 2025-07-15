# Atualizações necessárias.


## Curso

1- Adicionar coluna de 'trailer_url', 'thumbnail_url', 'difficulty' e 'category' no cadastro/entidade de curso.

2- Adicionar no get de cursos o nome do professor, quantidade de alunos, quantidade de aulas e quantidade de módulos.

3- Resolver Querys params de 'search', 'offset' e 'limit' que não estão funcionando corretamente.

4- rota '/course/' não está mandando o 'value', apenas a '/course/:id'.

5- rota de get de GET /student/{student_id}/courses deve retornar todas as caracteristicas do curso (incluindo as citadas no item 1) e também o progresso do aluno nesse curso em porcentagem (valores de 0 à 100).


OBS: verificar se esses requisitos estão sendo atentidos tanto na rota de curso geral quanto nas rotas de cursos por aluno (/student/:id/courses) e por professor (/teacher/:id/courses).


## Professor

1. Adicionar campo de profile_picture
2. Adicionar campo de biografia (bio)

