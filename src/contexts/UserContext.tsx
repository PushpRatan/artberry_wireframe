import { createContext, useContext, useMemo, useState, ReactNode } from "react";

type AccountType = "artist" | "patron";

interface UserContextValue {
  accountType: AccountType;
  setAccountType: (type: AccountType) => void;
  artistDiscipline: string | null;
  setArtistDiscipline: (discipline: string | null) => void;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [accountType, setAccountType] = useState<AccountType>("artist");
  const [artistDiscipline, setArtistDiscipline] = useState<string | null>(null);

  const value = useMemo(
    () => ({
      accountType,
      setAccountType,
      artistDiscipline,
      setArtistDiscipline,
    }),
    [accountType, artistDiscipline]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUserContext(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx)
    throw new Error("useUserContext must be used within a UserProvider");
  return ctx;
}
