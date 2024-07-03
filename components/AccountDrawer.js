import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  FormControl,
  Input,
  FormLabel,
  Radio,
  RadioGroup,
  HStack,
} from "@chakra-ui/react";
import { useRef } from "react";

export default function AccountDrawer({
  isOpen,
  onClose,
  username,
  email,
  gender,
  setUsername,
  setEmail,
  setGender,
  handleSubmit,
}) {
  const firstField = useRef();

  return (
    <>
      <Drawer
        initialFocusRef={firstField}
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent bg="#143E56" color="white">
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Edit your account</DrawerHeader>

          <DrawerBody>
            <FormControl>
              <FormLabel>Username</FormLabel>
              <Input
                ref={firstField}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </FormControl>
            <FormControl mt="20px">
              <FormLabel>Email</FormLabel>
              <Input
                disabled
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl mt="20px">
              <FormLabel>Gender</FormLabel>
              <RadioGroup defaultValue={gender}>
                <HStack spacing="24px">
                  <Radio
                    onChange={(e) => setGender(e.target.value)}
                    value="Male"
                  >
                    Male
                  </Radio>
                  <Radio
                    onChange={(e) => setGender(e.target.value)}
                    value="Female"
                  >
                    Female
                  </Radio>
                </HStack>
              </RadioGroup>
            </FormControl>
          </DrawerBody>

          <DrawerFooter borderTopWidth="1px">
            <Button color="white" variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} colorScheme="blue">
              Submit
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
