import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
} from '@chakra-ui/react';
import Link from 'next/link';
import { Component, ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

type State = {
  error: null | Error;
};
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    try {
      // Do something that could throw
    } catch (error) {
      if (error instanceof Error) {
        this.setState({ error });
      }
    }
  }

  render() {
    if (this.state.error) {
      return (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Something went Wrong</AlertTitle>
          <AlertDescription>
            Something went wrong, Please refresh the page or go back home!
            <Link href="/">
              <Button mt={3}> Go Home </Button>
            </Link>
          </AlertDescription>
        </Alert>
      );
    }
    return <>{this.props.children}</>;
  }
}
