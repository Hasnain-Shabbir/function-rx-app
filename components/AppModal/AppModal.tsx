import React, { ReactNode } from "react";
import { Modal, TouchableOpacity, View } from "react-native";
import { Button } from "../Button/Button";
import Typography from "../Typography/Typography";

interface AppModalProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  animationType?: "slide" | "fade" | "none";
  transparent?: boolean;
  showBorders?: boolean;
}

interface AppModalHeaderProps {
  title: string;
  onClose?: () => void;
  children?: ReactNode;
}

interface AppModalBodyProps {
  children: ReactNode;
  showBorders?: boolean;
}

interface AppModalFooterProps {
  children?: ReactNode;
  closeButtonText?: string;
  onClose?: () => void;
  showDefaultClose?: boolean;
}

const AppModal: React.FC<AppModalProps> & {
  Header: React.FC<AppModalHeaderProps>;
  Body: React.FC<AppModalBodyProps>;
  Footer: React.FC<AppModalFooterProps>;
} = ({
  visible,
  onClose,
  children,
  animationType = "fade",
  transparent = true,
  showBorders = true,
}) => {
  return (
    <Modal
      animationType={animationType}
      transparent={transparent}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white rounded-lg m-4 max-w-sm w-full">
          {children}
        </View>
      </View>
    </Modal>
  );
};

const AppModalHeader: React.FC<AppModalHeaderProps> = ({
  title,
  onClose,
  children,
}) => {
  return (
    <View className="flex-row justify-between items-center p-4">
      <Typography variant="body2" fontWeight="semibold" className="flex-1">
        {title}
      </Typography>
      {children}
      {onClose && (
        <TouchableOpacity onPress={onClose} className="ml-2">
          <Typography variant="body1" className="text-gray-500">
            ✕
          </Typography>
        </TouchableOpacity>
      )}
    </View>
  );
};

const AppModalBody: React.FC<AppModalBodyProps> = ({
  children,
  showBorders = true,
}) => {
  return (
    <View
      className={`p-4 ${showBorders ? "border-t border-b border-gray-200" : ""}`}
    >
      {children}
    </View>
  );
};

const AppModalFooter: React.FC<AppModalFooterProps> = ({
  children,
  closeButtonText = "Close",
  onClose,
  showDefaultClose = true,
}) => {
  return (
    <View className="flex-row justify-end gap-2 p-4">
      {children}
      {showDefaultClose && onClose && (
        <Button size={"sm"} variant={"outline"} onPress={onClose}>
          {closeButtonText}
        </Button>
      )}
    </View>
  );
};

// Assign the compound components
AppModal.Header = AppModalHeader;
AppModal.Body = AppModalBody;
AppModal.Footer = AppModalFooter;

export { AppModal };
