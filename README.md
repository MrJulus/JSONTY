# JSONTY - JSON-based Programming Language

## 📌 Introduction
JSONTY is a minimalist programming language based on JSON. It allows you to manipulate variables, perform operations, execute conditions, loops, and define functions.
Created by MrJulus

## Requirements
```text
fs, readline-sync
```

## NPM Package
You can also use the NPM Package : npm install jsonty

---

## 📖 Syntax

### 🔹 Defining Variables
```json
{
    "set": {
        "x": "10",
        "y": "20"
    }
}
```

### 🔹 Displaying Messages
```json
{
    "show": ["(x)"]
}
```

### 🔹 Mathematical Operations
```json
{
    "set": {
        "z": "(x) (+) (y)"
    }
}
```
> Different mathematical operations: +, -, *, /, =, !=, <=, and >=

## 🔄 Control Structures
### ✅ Conditions (if, else if, else)
```json
{
    "if": {
        "condition": "(x) (>) 5",
        "do": {
            "show": ["x is greater than 5"]
        }
    },
    "else if": {
        "condition": "(x) (<) 5",
        "do": {
            "show": ["x is less than 5"]
        }
    },
    "else": {
        "do": {
            "show": ["x is equal to 5"]
        }
    }
}
```

### 🔁 Loops (for, while)
```json
{
    "for": {
        "i": [1, 5],
        "do": {
            "show": ["(i)"]
        }
    }
}

{
    "while": {
        "condition": "(x) (<) 20",
        "do": {
            "set": {
                "x": "(x) (+) 1"
            },
            "show": ["(x)"]
        }
    }
}
```

## 🔧 Functions
### 🔹 Defining a Function
```json
{
    "fct": {
        "name": "calcul",
        "args": ["a", "b"],
        "do": {
            "set": {
                "result": "(a) (+) (b)"
            },
            "return": "(result)"
        }
    }
}
```

### 🔹 Defining a Function with Multiple Outputs
```json
{
    "fct": {
        "name": "calcul",
        "args": ["a", "b"],
        "do": {
            "set": {
                "addition": "(a) (+) (b)",
                "moins": "(a) (-) (b)"
            },
            "return": ["(result)", "(moins)"]
        }
    }
}
```

### 🔹 Calling a Function
```json
{
    "call": {
        "name": "calcul",
        "args": ["10", "5"]
    },
    "show": ["(result)"]
}
```

### 🔹 Calling a Function with Multiple Outputs
```json
{
    "call": {
        "name": "calcul",
        "args": ["10", "5"]
    },
    "show": ["(result[0]), (result[1])"]
}
```

### Switch Function
```json
{
    "switch": {
        "value": "(a)",
        "1": {
            "do": { 
                "show": ["a is 1"] 
            }
        },
        "2": {
            "do": {
                "show": ["a is 2"] 
            }
        },
        "default": {
            "do": { 
                "show": ["a is neither 1 nor 2"] 
            }
        }
    }
}

```

## ⌨️ User Input
```json
{
    "ask": {
        "q": "Enter your name"
    },
    "show": ["Hello, (q)!"]
}
```

## ⚠️ Error Handling (try/catch)
```json
{
    "try": {
        "do": {
            "set": {
                "x": "1 (/) 0"
            }
        }
    },
    "catch": {
        "do": {
            "show": ["Error detected: (error)"]
        }
    }
}

```

## Contributors
Mr_Julus (@MrJulus)