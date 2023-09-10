export type NutrionValue = {
  // Name
  Namn: string
  // Abbreviation
  Forkortning: string
  // Value
  Varde: string | number
  // Unit
  Enhet: string
  // Last Changed
  SenastAndrad: string
  // Value Type
  Vardetyp?: string
  // Origin
  Ursprung?: string
  // Publication
  Publikation?: string
  // Production Method
  Framtagningsmetod?: string
  // Method Type
  Metodtyp?: string
  // Reference Type
  Referenstyp?: string
  // Comment
  Kommentar?: string | number
}

export type Food = {
  // Number (ID in the Livesmedelsdatabasen)
  Nummer: number
  // Name
  Namn: string
  // Weight in gram
  ViktGram: number
  // Main Group
  Huvudgrupp: string
  // Nutrition values
  Naringsvarden: {
    Naringsvarde: NutrionValue[]
  }
}

export type LivsmedelDataset = {
  Version: string
  LivsmedelsLista: {
    Livsmedel: Food[]
  }
}

export type Livsmedeldatabas = {
  LivsmedelDataset: LivsmedelDataset
}
