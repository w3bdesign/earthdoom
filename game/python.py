import random

adjectives = ['Amazing', 'Awesome', 'Incredible', 'Fantastic', 'Superb']
nouns = ['Feature', 'Update', 'Bugfix', 'Refactor', 'Improvement']

random_adjective = random.choice(adjectives)
random_noun = random.choice(nouns)

commit_message = f"{random_adjective} {random_noun}"
print(commit_message)
