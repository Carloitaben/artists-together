export const APPLICATION_ID = "1097235077966073927"

export const CHANNELS =
  process.env.NODE_ENV === "development"
    ? {
        ROLES: "1097464220720840795",
      }
    : {
        ROLES: "780233965310181407",
      }

export const ROLES =
  process.env.NODE_ENV === "development"
    ? {
        PRONOUNS_THEY_THEM: "1097474639384555550",
        PRONOUNS_SHE_HER: "1097474589841436722",
        PRONOUNS_HE_HIM: "1097474617960042628",
        REGION_USA: "1097589914276728852",
        REGION_CANADA: "1097589945515905144",
        REGION_EUROPE: "1097589969784164413",
        REGION_AUSTRALIA: "1097589995612680262",
        REGION_AFRICA: "1097590019855757322",
        REGION_ASIA: "1097590046556684288",
        REGION_SOUTH_AMERICA: "1097590064298598411",
        REGION_MEXICO: "1097590096120791141",
        REGION_NEW_ZEALAND: "1097590122234511372",
        REGION_UNITED_KINGDOM: "1097590158808850543",
      }
    : {
        PRONOUNS_THEY_THEM: "",
        PRONOUNS_SHE_HER: "",
        PRONOUNS_HE_HIM: "",
        REGION_USA: "780235217247797279",
        REGION_CANADA: "780235440069804074",
        REGION_EUROPE: "780235639400300577",
        REGION_AUSTRALIA: "780235905964703775",
        REGION_AFRICA: "780236094251204608",
        REGION_ASIA: "780236371776241714",
        REGION_SOUTH_AMERICA: "780236583097204736",
        REGION_MEXICO: "780317122802745354",
        REGION_NEW_ZEALAND: "925111668227317821",
        REGION_UNITED_KINGDOM: "925112441875095612",
      }
