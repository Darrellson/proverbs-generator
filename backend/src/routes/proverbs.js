const express = require('express');
const router = express.Router();

const proverbs =[
    "ვინ დაანება, ის არ იწვევს.",
    "ცდილობ, გეტყვის, არადა რად გეტყვის.",
    "შენს სიცოცხლეს დროს უნდა მისცე, თუ არ გამოგიტანს.",
    "ბევრ რამეზე კი სჯობს ორი სიტყვა, ერთი.",
    "ამბაზერული ლამაზი იქნებე.",
    "ჩაკავებული ყველაფრით, თავს არასოდეს წაიშლიდა.",
    "ვინ არის აქ ისეთი, ვინც ასე გამოდგა?",
    "სიყვარულზე ჯერ მარტო არაფერი არ გავიგეთ.",
    "დაუიარაყება და დატრიალდება, აგრესია თუკი არც გაგჭვრეტია.",
    "გჭირდებათ ახალ მოძველების შესაძლებლობა!",
    "ფული ყველგან დაგესიზმრება, შენ კი მასთან ნუ ხდები.",
    "ნუ დაუშვებ ჩრდილებს, როცა გინდა სინათლე.",
    "მოდი, დილა და ვთქვათ.",
    "უნდა გააკეთო ისე, რომ სხვა კარგამო შენს მარცხსაც პატივს სცემდეს.",
    "ადამიანის გული დედამიწაზე ბევრად თბილია.",
    "რა წერია - ის, რაც გააკეთე.",
    "რაც არ უნდა გითხრათ, უნდა დაიჯერო.",
    "ყველა ნათელი თვალებით ვერ ხედავს.",
    "ასე არაა, რომ ყველა სჭირდება ბედნიერებას.",
    "შენი ბედნიერება მხოლოდ შენშია.",
    "იქნება წყნარი გზა, სადაც უბრალოდ იარო.",
    "გულს ბარძიმის ბედი აქვს.",
    "ვერაფერს ვერ წაგაყენებენ, თუ თავად არ გაჩერებ.",
    "მივლენ ადამიანებამდე, როცა ეჭვი გაქვს.",
    "რაც ტკივილი გაქვს, ისე არაა გზა მშვიდად.",
    "გეცოდინება, სადაც ორზე ბევრი ერთმანეთშია.",
    "ერთნაირი გზები უამრავ უბედურებას მოაქვს.",
    "ყველაფერი რომ ეცოდინება, მაინც ჯობია მოყვარეობა.",
    "გრძნობ, რომ თვითონ იყო მიზეზი.",
    "არ აქვს სიცოცხლე ახალი აზრების გარეშე.",
    "დაიმახსოვრე, ბედნიერება გარედან არ მოდის.",
    "ყოველთვის ნუ აყვები.",
    "რაც ჩუმად გეუბნება, ის გადასწყვიტავს.",
    "ყველაფერი სწორია, თუ არ გეხება.",
    "არასოდეს არ იქნები იმ ადგილზე, სადაც გამოხვედი.",
    "შუა გზა აუცილებლად გააგებინებს.",
    "ყველაფერში სიკეთე უნდა დაინახო.",
    "ჭკუას გრძნობ, თუ ფეხის ნაბიჯი თხელი.",
    "მიდიხარ გზაზე, როცა ისე გგონია.",
    "უკვე შეძლებ შეძლო, თუ არ მიხვდები.",
    "არ იქნება არაფერი ისეთი, თუ არ დაუკარგავთ.",
    "ყოველთვის გააკეთე უკეთესი, რომ სწორი წილი იყოს.",
    "ასე ყოველთვის მაინც სხვები გამოდიან.",
    "გიჭირს, მაგრამ არც ერთი გზა არ იპოვის.",
    "დრო და გრძნობა ყველაფერს ააშენებს.",
    "არ არსებობს გზა, სადაც მარტო რამეს ვერ შეგიქმნი.",
    "ყველა ჩვენი გზა სწორი, ისე კარგად არც არავის.",
    "ბევრზე ძლიერი გახდები, თუკი გზა გექნება.",
    "წინდაუხედავად არ შეგაწუხებს ბედნიერება.",
    "არ უნდა გქონდეს სიცარიელე, თუ გინდა ყველაზე უკეთესიდან."
  ];

  router.get('/', (req, res) => {
    const firstProverb = proverbs[Math.floor(Math.random() * proverbs.length)];
    const secondProverb = proverbs[Math.floor(Math.random() * proverbs.length)];
  
    const secondPart = firstProverb.split(',').slice(1).join(',');
    const firstPart = secondProverb.split(',')[0];
  
    const combined = `${firstPart},${secondPart}`;
    res.json({ combined });
  });
  
module.exports = router;
