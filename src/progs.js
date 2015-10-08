module.exports = {
  hello: `# Welcome to Sprak, yo!
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
