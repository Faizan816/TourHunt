import {
  Button,
  useBreakpointValue,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { useRef } from "react";

export default function DeleteDialog({
  isOpen,
  onClose,
  handleDelete,
  title,
  description,
  id,
}) {
  const cancelRef = useRef();
  const isMobile = useBreakpointValue({
    base: true,
    sm: true,
    md: false,
    lg: false,
    xl: false,
  });

  return (
    <>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent
            style={isMobile ? { width: "70%" } : { width: "50%" }}
            bg="#1F516D"
            color="white"
          >
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {title}
            </AlertDialogHeader>

            <AlertDialogBody>{description}</AlertDialogBody>

            <AlertDialogFooter>
              <Button
                bg="#2A656D"
                color="white"
                _hover={{ opacity: 0.5 }}
                ref={cancelRef}
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                bg="#AC3116"
                color="white"
                _hover={{ opacity: 0.5 }}
                onClick={() => {
                  handleDelete(id);
                  onClose();
                }}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
