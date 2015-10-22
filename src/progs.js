module.exports = {
  hello: `ClearText()
Bar()
Print("this thing")
Print("rules. " + (5 * (2 + 1)))
Bar()
void Bar()
  Print("==============")
end
`,
  hello2: `# Welcome to Sprak, yo!
var a = 1.5
var b = Random()
var c = 2

# Print it out!
ClearText()
Print("Welcome to Sprak.")
Bar()
Print("Some math:")
Print((a + b) * c)
Bar()

# Mem
SaveMemory("a", 10)
var a = LoadMemory("a")
Print(a)

void Bar()
  Print("==============")
end
  `,
  mem: `# Mem
SaveMemory("a", 10)
var a = LoadMemory("a")
Print(a)
  `
};
