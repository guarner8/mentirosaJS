function die_combination_list(n) {
    
    function recursive_roll(n, roll=[]) {
        if (n === 0) {
            die_combination_list.push([...roll]);
        } else {
            for (let i = 0; i < 6; i++) {
                roll.push(die_faces[i]);
                recursive_roll(n-1, roll);
                roll.pop();
            }
        }
    }
  
    let die_faces = ['A', 'K', 'Q', 'J', '10', '9'];
    let die_combination_list = [];
    recursive_roll(n);

    return die_combination_list;
}

console.log(die_combination_list(5))
