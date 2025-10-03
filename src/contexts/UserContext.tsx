import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type AccountType = "artist" | "patron";

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
}

interface SubscriptionState {
  active: boolean;
  plan?: SubscriptionPlan;
}

interface UserContextValue {
  accountType: AccountType;
  setAccountType: (type: AccountType) => void;
  artistDiscipline: string | null;
  setArtistDiscipline: (discipline: string | null) => void;
  subscription: SubscriptionState;
  setSubscription: (sub: SubscriptionState) => void;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [accountType, setAccountType] = useState<AccountType>("artist");
  const [artistDiscipline, setArtistDiscipline] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionState>({
    active: false,
  });

  const value = useMemo(
    () => ({
      accountType,
      setAccountType,
      artistDiscipline,
      setArtistDiscipline,
      subscription,
      setSubscription,
    }),
    [accountType, artistDiscipline, subscription]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUserContext(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx)
    throw new Error("useUserContext must be used within a UserProvider");
  return ctx;
}
