export interface DAOItemProps {
  name: string | null | undefined;
  address: string;
  // TODO: Add more fields
}

export interface DAOCosigner {
  name: string;
  weight: number;
  id: number;
}
